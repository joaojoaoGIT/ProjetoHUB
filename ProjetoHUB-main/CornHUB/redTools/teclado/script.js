/* ============================================================
 * TECLADO MUSICAL VIRTUAL
 * Usa WebAudioFont (via CDN) para carregar instrumentos GM
 * automaticamente, sem precisar de arquivos de áudio locais.
 * ============================================================ */

// ---------- Configuração das notas ----------
// Mapeia cada tecla do computador a uma nota musical (MIDI).
// Duas oitavas (C4 → C6).
const KEY_MAP = [
  { key: 'a', note: 'C4',  midi: 60, type: 'white' },
  { key: 'w', note: 'C#4', midi: 61, type: 'black' },
  { key: 's', note: 'D4',  midi: 62, type: 'white' },
  { key: 'e', note: 'D#4', midi: 63, type: 'black' },
  { key: 'd', note: 'E4',  midi: 64, type: 'white' },
  { key: 'f', note: 'F4',  midi: 65, type: 'white' },
  { key: 't', note: 'F#4', midi: 66, type: 'black' },
  { key: 'g', note: 'G4',  midi: 67, type: 'white' },
  { key: 'y', note: 'G#4', midi: 68, type: 'black' },
  { key: 'h', note: 'A4',  midi: 69, type: 'white' },
  { key: 'u', note: 'A#4', midi: 70, type: 'black' },
  { key: 'j', note: 'B4',  midi: 71, type: 'white' },
  { key: 'k', note: 'C5',  midi: 72, type: 'white' },
  { key: 'o', note: 'C#5', midi: 73, type: 'black' },
  { key: 'l', note: 'D5',  midi: 74, type: 'white' },
  { key: 'p', note: 'D#5', midi: 75, type: 'black' },
  { key: ';', note: 'E5',  midi: 76, type: 'white' },
  { key: "'", note: 'F5',  midi: 77, type: 'white' },
];

// Instrumentos disponíveis (variáveis globais expostas pelo WebAudioFont).
// Cada item indica o nome da variável JS e o arquivo .js a carregar via CDN.
const INSTRUMENTS = {
  piano:    { var: '_tone_0000_JCLive_sf2_file',        file: '0000_JCLive_sf2_file.js',        name: 'Piano' },
  guitar:   { var: '_tone_0240_Aspirin_sf2_file',       file: '0240_Aspirin_sf2_file.js',       name: 'Guitarra' },
  flute:    { var: '_tone_0730_Aspirin_sf2_file',       file: '0730_Aspirin_sf2_file.js',       name: 'Flauta' },
  drums:    { var: '_drum_35_0_Chaos_sf2_file',         file: '12835_0_Chaos_sf2_file.js',      name: 'Bateria', isDrum: true },
};

const CDN_BASE = 'https://surikov.github.io/webaudiofontdata/sound/';

// ---------- Estado global ----------
const state = {
  audioContext: null,
  player: null,
  currentInstrument: 'piano',
  loadedInstruments: {}, // cache: { piano: tone, guitar: tone, ... }
  recording: false,
  recordStartTime: 0,
  recordedEvents: [],    // [{ midi, note, time }]
  isPlaying: false,
};

// ---------- Elementos DOM ----------
const keyboardEl = document.getElementById('keyboard');
const instrumentSelect = document.getElementById('instrument');
const recordBtn = document.getElementById('recordBtn');
const playBtn = document.getElementById('playBtn');
const clearBtn = document.getElementById('clearBtn');
const recordedNotesEl = document.getElementById('recordedNotes');
const statusEl = document.getElementById('status');

// ---------- Construção do teclado ----------
function buildKeyboard() {
  const whiteKeys = KEY_MAP.filter(k => k.type === 'white');
  const whiteWidthPct = 100 / whiteKeys.length;

  // Cria primeiro as brancas (fluxo normal)
  let whiteIndex = 0;
  KEY_MAP.forEach((k) => {
    if (k.type === 'white') {
      const el = document.createElement('div');
      el.className = 'key white';
      el.dataset.midi = k.midi;
      el.dataset.key = k.key;
      el.innerHTML = `<span class="note">${k.note}</span><span class="kbd">${k.key.toUpperCase()}</span>`;
      bindKey(el, k);
      keyboardEl.appendChild(el);
      k._whiteIndex = whiteIndex++;
    }
  });

  // Em seguida posiciona as pretas em cima
  KEY_MAP.forEach((k, idx) => {
    if (k.type === 'black') {
      // A preta fica entre a branca anterior (idx-1) e a próxima (idx+1)
      const prevWhite = KEY_MAP[idx - 1];
      const leftPct = (prevWhite._whiteIndex + 1) * whiteWidthPct - (whiteWidthPct * 0.3);
      const el = document.createElement('div');
      el.className = 'key black';
      el.dataset.midi = k.midi;
      el.dataset.key = k.key;
      el.style.left = `calc(${leftPct}% )`;
      el.style.width = `${whiteWidthPct * 0.6}%`;
      el.innerHTML = `<span class="note">${k.note}</span><span class="kbd">${k.key.toUpperCase()}</span>`;
      bindKey(el, k);
      keyboardEl.appendChild(el);
    }
  });
}

function bindKey(el, k) {
  el.addEventListener('mousedown', () => playNote(k.midi, k.note, el));
  el.addEventListener('touchstart', (e) => { e.preventDefault(); playNote(k.midi, k.note, el); }, { passive: false });
}

// ---------- Áudio / WebAudioFont ----------
function ensureAudio() {
  if (!state.audioContext) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    state.audioContext = new Ctx();
    state.player = new WebAudioFontPlayer();
  }
  if (state.audioContext.state === 'suspended') state.audioContext.resume();
}

// Carrega um instrumento sob demanda e o mantém em cache.
function loadInstrument(name) {
  return new Promise((resolve, reject) => {
    ensureAudio();
    if (state.loadedInstruments[name]) return resolve(state.loadedInstruments[name]);

    const cfg = INSTRUMENTS[name];
    if (!cfg) return reject(new Error('Instrumento desconhecido: ' + name));

    setStatus(`Carregando ${cfg.name}...`, 'loading');
    const url = CDN_BASE + cfg.file;
    state.player.loader.startLoad(state.audioContext, url, cfg.var);
    state.player.loader.waitLoad(() => {
      const tone = window[cfg.var];
      state.loadedInstruments[name] = tone;
      setStatus(`${cfg.name} pronto. Toque algo!`);
      resolve(tone);
    });
  });
}

function playNote(midi, noteName, el) {
  ensureAudio();
  const tone = state.loadedInstruments[state.currentInstrument];
  if (!tone) return;

  state.player.queueWaveTable(
    state.audioContext,
    state.audioContext.destination,
    tone,
    0,
    midi,
    1.2 // duração em segundos
  );

  // Destaque visual
  if (el) {
    el.classList.add('active');
    setTimeout(() => el.classList.remove('active'), 200);
  }

  // Gravação
  if (state.recording) {
    state.recordedEvents.push({
      midi,
      note: noteName,
      time: performance.now() - state.recordStartTime,
    });
    renderRecorded();
  }
}

// ---------- Teclado físico ----------
const pressedKeys = new Set();
document.addEventListener('keydown', (e) => {
  if (e.repeat) return;
  const k = KEY_MAP.find(m => m.key === e.key.toLowerCase());
  if (!k || pressedKeys.has(k.key)) return;
  pressedKeys.add(k.key);
  const el = keyboardEl.querySelector(`[data-midi="${k.midi}"]`);
  playNote(k.midi, k.note, el);
});
document.addEventListener('keyup', (e) => {
  pressedKeys.delete(e.key.toLowerCase());
});

// ---------- Gravação ----------
function toggleRecording() {
  if (state.isPlaying) return;
  state.recording = !state.recording;
  if (state.recording) {
    state.recordedEvents = [];
    state.recordStartTime = performance.now();
    recordBtn.textContent = '■ Parar';
    recordBtn.classList.add('active');
    setStatus('Gravando...', 'recording');
    renderRecorded();
  } else {
    recordBtn.textContent = '● Gravar';
    recordBtn.classList.remove('active');
    setStatus(`Gravação finalizada (${state.recordedEvents.length} notas).`);
  }
  updateButtons();
}

async function playRecording() {
  if (state.recordedEvents.length === 0 || state.recording) return;
  state.isPlaying = true;
  updateButtons();
  setStatus('Reproduzindo gravação...');

  const start = performance.now();
  for (const ev of state.recordedEvents) {
    const wait = ev.time - (performance.now() - start);
    if (wait > 0) await new Promise(r => setTimeout(r, wait));
    const el = keyboardEl.querySelector(`[data-midi="${ev.midi}"]`);
    playNote(ev.midi, ev.note, el);
  }

  setTimeout(() => {
    state.isPlaying = false;
    updateButtons();
    setStatus('Reprodução concluída.');
  }, 1200);
}

function clearRecording() {
  if (state.recording || state.isPlaying) return;
  state.recordedEvents = [];
  renderRecorded();
  setStatus('Gravação limpa.');
  updateButtons();
}

function renderRecorded() {
  recordedNotesEl.innerHTML = state.recordedEvents
    .map(e => `<span class="note-chip">${e.note}</span>`)
    .join('');
}

function updateButtons() {
  playBtn.disabled = state.recordedEvents.length === 0 || state.recording || state.isPlaying;
  clearBtn.disabled = state.recordedEvents.length === 0 || state.recording || state.isPlaying;
  recordBtn.disabled = state.isPlaying;
}

// ---------- Status helper ----------
function setStatus(msg, cls = '') {
  statusEl.textContent = msg;
  statusEl.className = 'status ' + cls;
}

// ---------- Inicialização ----------
function init() {
  buildKeyboard();

  // Popula seletor
  Object.entries(INSTRUMENTS).forEach(([key, cfg]) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = cfg.name;
    instrumentSelect.appendChild(opt);
  });

  instrumentSelect.addEventListener('change', async (e) => {
    state.currentInstrument = e.target.value;
    await loadInstrument(state.currentInstrument);
  });

  recordBtn.addEventListener('click', toggleRecording);
  playBtn.addEventListener('click', playRecording);
  clearBtn.addEventListener('click', clearRecording);

  updateButtons();

  // Primeira interação carrega o piano (necessário para destravar AudioContext)
  const unlock = async () => {
    await loadInstrument('piano');
    document.removeEventListener('click', unlock);
    document.removeEventListener('keydown', unlock);
  };
  document.addEventListener('click', unlock);
  document.addEventListener('keydown', unlock);

  setStatus('Clique em qualquer lugar para iniciar o áudio.');
}

// Aguarda DOM + script da CDN
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
