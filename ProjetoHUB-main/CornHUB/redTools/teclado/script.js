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
  { key: 'ç', note: 'E5',  midi: 76, type: 'white' },
 
];

// Instrumentos disponíveis (variáveis globais expostas pelo WebAudioFont).
// Cada item indica o nome da variável JS e o arquivo .js a carregar via CDN.
const INSTRUMENTS = {
  piano:    { var: '_tone_0000_JCLive_sf2_file',        file: '0000_JCLive_sf2_file.js',        name: 'Piano' },
  guitar:   { var: '_tone_0240_Aspirin_sf2_file',       file: '0240_Aspirin_sf2_file.js',       name: 'Guitarra' },
  flute:    { var: '_tone_0730_Aspirin_sf2_file',       file: '0730_Aspirin_sf2_file.js',       name: 'Flauta' },
  drums:    { var: '_drum_35_0_Chaos_sf2_file',         file: '12835_0_Chaos_sf2_file.js',      name: 'Bateria', isDrum: true },
};

// ---------- Conversão para sistema solfege (Dó Ré Mi...) ----------
function noteToSolfeggio(note) {
  const m = note.match(/^([A-G]#?)(\d+)$/);
  if (!m) return note;
  const name = m[1];
  const octave = m[2];
  const map = {
    'C': 'Dó', 'C#': 'Dó♯',
    'D': 'Ré', 'D#': 'Ré♯',
    'E': 'Mi',
    'F': 'Fá', 'F#': 'Fá♯',
    'G': 'Sol', 'G#': 'Sol♯',
    'A': 'Lá', 'A#': 'Lá♯',
    'B': 'Si'
  };
  return (map[name] || name) + octave;
}

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
  octaveOffset: 0,
};

// ---------- Elementos DOM ----------
const keyboardEl = document.getElementById('keyboard');
const instrumentDisplay = document.getElementById('instrumentDisplay');
const instPrev = document.getElementById('instPrev');
const instNext = document.getElementById('instNext');
const recordBtn = document.getElementById('recordBtn');
const playBtn = document.getElementById('playBtn');
const clearBtn = document.getElementById('clearBtn');
const recordedNotesEl = document.getElementById('recordedNotes');
const statusEl = document.getElementById('status');
const themeToggle = document.getElementById('themeToggle');
const octDown = document.getElementById('octDown');
const octUp = document.getElementById('octUp');
const octDisplay = document.getElementById('octDisplay');

const OCTAVE_MIN = -1;
const OCTAVE_MAX = 1;

// Ordem dos instrumentos (para navegação prev/next)
const instrumentKeys = Object.keys(INSTRUMENTS);
let instrumentIndex = 0;

// Emojis temporários para cada instrumento (usuário ajustará os ícones depois)
const INSTRUMENT_EMOJIS = {
  piano: '🎹',
  guitar: '🎸',
  flute: '🎶',
  drums: '🥁'
};

// ---------- Construção do teclado ----------
function midiToNoteName(midi) {
  const names = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const note = names[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return note + octave;
}

function clampMidi(m) {
  if (m < 0) return 0;
  if (m > 127) return 127;
  return m;
}

function buildKeyboard() {
  // limpa antes de criar
  keyboardEl.innerHTML = '';
  const whiteKeys = KEY_MAP.filter(k => k.type === 'white');
  const whiteWidthPct = 100 / whiteKeys.length;

  // Cria primeiro as brancas (fluxo normal)
  let whiteIndex = 0;
  KEY_MAP.forEach((k) => {
    if (k.type === 'white') {
      const shiftedMidi = clampMidi(k.midi + state.octaveOffset * 12);
      const shiftedNote = midiToNoteName(shiftedMidi);
      const el = document.createElement('div');
      el.className = 'key white';
      el.dataset.midi = shiftedMidi;
      el.dataset.baseMidi = k.midi;
      el.dataset.key = k.key;
      const label = noteToSolfeggio(shiftedNote);
      el.innerHTML = `<span class="note">${label}</span><span class="kbd">${k.key.toUpperCase()}</span>`;
      bindKey(el, shiftedMidi, shiftedNote);
      keyboardEl.appendChild(el);
      k._whiteIndex = whiteIndex++;
    }
  });

  // Em seguida posiciona as pretas em cima
  KEY_MAP.forEach((k, idx) => {
    if (k.type === 'black') {
      const prevWhite = KEY_MAP[idx - 1];
      const leftPct = (prevWhite._whiteIndex + 1) * whiteWidthPct - (whiteWidthPct * 0.3);
      const shiftedMidi = clampMidi(k.midi + state.octaveOffset * 12);
      const shiftedNote = midiToNoteName(shiftedMidi);
      const el = document.createElement('div');
      el.className = 'key black';
      el.dataset.midi = shiftedMidi;
      el.dataset.baseMidi = k.midi;
      el.dataset.key = k.key;
      el.style.left = `calc(${leftPct}% )`;
      el.style.width = `${whiteWidthPct * 0.6}%`;
      const label = noteToSolfeggio(shiftedNote);
      el.innerHTML = `<span class="note">${label}</span><span class="kbd">${k.key.toUpperCase()}</span>`;
      bindKey(el, shiftedMidi, shiftedNote);
      keyboardEl.appendChild(el);
    }
  });
}

function bindKey(el, midi, noteName) {
  el.addEventListener('mousedown', () => playNote(Number(midi), noteName, el));
  el.addEventListener('touchstart', (e) => { e.preventDefault(); playNote(Number(midi), noteName, el); }, { passive: false });
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
  // encontra a tecla pelo data-key (estável mesmo com deslocamento de oitava)
  const el = keyboardEl.querySelector(`[data-key="${k.key}"]`);
  if (el) {
    const midi = Number(el.dataset.midi);
    const note = el.querySelector('.note') ? el.querySelector('.note').textContent : k.note;
    playNote(midi, midiToNoteName(midi), el);
  }
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
    if (el) playNote(ev.midi, ev.note, el);
    else playNote(ev.midi, ev.note, null);
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
    .map(e => `<span class="note-chip">${noteToSolfeggio(e.note)}</span>`)
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

/* ===== Tema (claro / escuro) ===== */
function applyTheme(theme) {
  try {
    document.body.setAttribute('data-theme', theme === 'light' ? 'light' : 'dark');
    if (themeToggle) {
      const icon = document.getElementById('themeIcon');
      if (icon) {
        icon.src = theme === 'light' ? 'assets/sun-solid.png' : 'assets/moon-solid.png';
        icon.alt = theme === 'light' ? 'Tema claro' : 'Tema escuro';
      }
      themeToggle.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
    }
    localStorage.setItem('tecladoTheme', theme);
  } catch (e) {
    // localStorage pode falhar em alguns contextos — ignorar
  }
}

function toggleTheme() {
  const current = document.body.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
}

// ---------- Inicialização ----------
function init() {
  // lê preferência de oitava antes de construir o teclado
  try {
    const savedOct = parseInt(localStorage.getItem('tecladoOctaveOffset'), 10);
    if (!Number.isNaN(savedOct)) state.octaveOffset = Math.max(OCTAVE_MIN, Math.min(OCTAVE_MAX, savedOct));
  } catch (e) {}
  buildKeyboard();

  // Inicializa picker de instrumentos (prev/next + display)
  try {
    const savedInst = localStorage.getItem('tecladoInstrument');
    if (savedInst && instrumentKeys.includes(savedInst)) instrumentIndex = instrumentKeys.indexOf(savedInst);
  } catch (e) {}

  function updateInstrumentDisplay() {
    if (!instrumentDisplay) return;
    const key = instrumentKeys[instrumentIndex];
    const cfg = INSTRUMENTS[key];
    const emoji = INSTRUMENT_EMOJIS[key] || '🎵';
    const emojiEl = instrumentDisplay.querySelector('.inst-emoji');
    const nameEl = instrumentDisplay.querySelector('.inst-name');
    if (emojiEl) emojiEl.textContent = emoji;
    if (nameEl) nameEl.textContent = cfg.name;
    // prev/next previews
    if (instPrev) instPrev.textContent = INSTRUMENT_EMOJIS[instrumentKeys[(instrumentIndex - 1 + instrumentKeys.length) % instrumentKeys.length]] || '◀';
    if (instNext) instNext.textContent = INSTRUMENT_EMOJIS[instrumentKeys[(instrumentIndex + 1) % instrumentKeys.length]] || '▶';
  }

  async function setInstrumentByIndex(idx) {
    instrumentIndex = ((idx % instrumentKeys.length) + instrumentKeys.length) % instrumentKeys.length;
    state.currentInstrument = instrumentKeys[instrumentIndex];
    updateInstrumentDisplay();
    try { localStorage.setItem('tecladoInstrument', state.currentInstrument); } catch (e) {}
    await loadInstrument(state.currentInstrument);
  }

  if (instPrev) instPrev.addEventListener('click', () => setInstrumentByIndex(instrumentIndex - 1));
  if (instNext) instNext.addEventListener('click', () => setInstrumentByIndex(instrumentIndex + 1));

  // inicializa instrumento atual
  setInstrumentByIndex(instrumentIndex);

  recordBtn.addEventListener('click', toggleRecording);
  playBtn.addEventListener('click', playRecording);
  clearBtn.addEventListener('click', clearRecording);

  updateButtons();

  // Oitava: controles
  function updateOctDisplay() {
    if (octDisplay) octDisplay.textContent = state.octaveOffset === 0 ? '0' : (state.octaveOffset > 0 ? `+${state.octaveOffset}` : `${state.octaveOffset}`);
    if (octDown) octDown.disabled = state.octaveOffset <= OCTAVE_MIN;
    if (octUp) octUp.disabled = state.octaveOffset >= OCTAVE_MAX;
  }

  function setOctave(offset) {
    state.octaveOffset = Math.max(OCTAVE_MIN, Math.min(OCTAVE_MAX, offset));
    try { localStorage.setItem('tecladoOctaveOffset', String(state.octaveOffset)); } catch (e) {}
    updateOctDisplay();
    buildKeyboard();
  }

  if (octDown) octDown.addEventListener('click', () => setOctave(state.octaveOffset - 1));
  if (octUp) octUp.addEventListener('click', () => setOctave(state.octaveOffset + 1));
  updateOctDisplay();

  // Inicializa tema (persistência e detecção do sistema)
  try {
    const saved = localStorage.getItem('tecladoTheme');
    if (saved) applyTheme(saved);
    else {
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(prefersDark ? 'dark' : 'light');
    }
  } catch (e) {}
  if (themeToggle) themeToggle.addEventListener('click', toggleTheme);

  // Primeira interação carrega o piano (necessário para destravar AudioContext)
  const unlock = async () => {
    await loadInstrument(state.currentInstrument);
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
