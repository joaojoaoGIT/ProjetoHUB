/**
 * WoodKeys Studio - Standalone JavaScript
 * Teclado musical interativo com gravacao e edicao de faixas
 */

(function() {
  'use strict';

  // ============================================================
  // CONFIG - WebAudioFont sound bank configuration
  // ============================================================
  const SOUNDS = {
    piano: { variable: '_tone_0000_JCLive_sf2_file', url: 'https://surikov.github.io/webaudiofontdata/sound/0000_JCLive_sf2_file.js' },
    flute: { variable: '_tone_0730_Aspirin_sf2_file', url: 'https://surikov.github.io/webaudiofontdata/sound/0730_Aspirin_sf2_file.js' },
    guitar: { variable: '_tone_0240_Aspirin_sf2_file', url: 'https://surikov.github.io/webaudiofontdata/sound/0240_Aspirin_sf2_file.js' },
    // Drum sounds - using correct FluidR3 GM bank names
    kick: { variable: '_drum_35_0_FluidR3_GM_sf2_file', url: 'https://surikov.github.io/webaudiofontdata/sound/12835_0_FluidR3_GM_sf2_file.js', midi: 35 },
    snare: { variable: '_drum_38_0_FluidR3_GM_sf2_file', url: 'https://surikov.github.io/webaudiofontdata/sound/12838_0_FluidR3_GM_sf2_file.js', midi: 38 },
    hihat_closed: { variable: '_drum_42_0_FluidR3_GM_sf2_file', url: 'https://surikov.github.io/webaudiofontdata/sound/12842_0_FluidR3_GM_sf2_file.js', midi: 42 },
    hihat_open: { variable: '_drum_46_0_FluidR3_GM_sf2_file', url: 'https://surikov.github.io/webaudiofontdata/sound/12846_0_FluidR3_GM_sf2_file.js', midi: 46 },
    crash: { variable: '_drum_49_0_FluidR3_GM_sf2_file', url: 'https://surikov.github.io/webaudiofontdata/sound/12849_0_FluidR3_GM_sf2_file.js', midi: 49 },
  };

  const DRUM_PADS = [
    { name: 'Bumbo', key: 'q', sound: 'kick', color: '#dc2626', size: 'large' },
    { name: 'Caixa', key: 'w', sound: 'snare', color: '#d97706', size: 'large' },
    { name: 'Hi-Hat', key: 'e', sound: 'hihat_closed', color: '#059669', size: 'medium' },
    { name: 'Open H.', key: 'r', sound: 'hihat_open', color: '#10b981', size: 'medium' },
    { name: 'Prato', key: 't', sound: 'crash', color: '#0284c7', size: 'medium' },
  ];

  const OCTAVE_KEYS = [
    { note: 'C', isBlack: false, kb: 'a' },
    { note: 'C#', isBlack: true, kb: 'w' },
    { note: 'D', isBlack: false, kb: 's' },
    { note: 'D#', isBlack: true, kb: 'e' },
    { note: 'E', isBlack: false, kb: 'd' },
    { note: 'F', isBlack: false, kb: 'f' },
    { note: 'F#', isBlack: true, kb: 't' },
    { note: 'G', isBlack: false, kb: 'g' },
    { note: 'G#', isBlack: true, kb: 'y' },
    { note: 'A', isBlack: false, kb: 'h' },
    { note: 'A#', isBlack: true, kb: 'u' },
    { note: 'B', isBlack: false, kb: 'j' },
  ];

  const OCTAVE2_KEYS = {
    z: 0, x: 2, c: 4, v: 5, b: 7, n: 9, m: 11,
    q: 1, '2': 3, r: 6, '5': 8, '6': 10
  };

  const TRACK_COLORS = ['#d97706', '#059669', '#0284c7', '#dc2626', '#7c3aed', '#db2777', '#65a30d', '#0891b2'];
  const INST_LABELS = { piano: 'Piano', flute: 'Flauta', guitar: 'Violao', drums: 'Bateria' };

  // ============================================================
  // STATE
  // ============================================================
  let audioCtx = null;
  let masterGain = null;
  let player = null;
  const loadedFonts = {};
  const loadingFonts = {};
  const activeVoices = {}; // Track active voices per key for polyphony management

  let currentInstrument = 'piano';
  let currentOctave = 3;
  let theme = 'dark';
  let isRecording = false;
  let playbackActive = false;
  const tracks = [];
  let recordStartTime = 0;
  let recordNotes = [];
  const activeNoteStarts = {};
  const pressedKeys = new Set();
  const activeNotes = new Set();
  const activeDrumPads = new Set();
  const activeDrumPadStartTimes = {}; // Track when each drum pad was pressed for sustained notes

  // ============================================================
  // AUDIO ENGINE
  // ============================================================
  function getAudioContext() {
    if (!audioCtx || audioCtx.state === 'closed') {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      // Create master gain node for volume control and to prevent clipping
      masterGain = audioCtx.createGain();
      masterGain.gain.value = 0.4; // 40% master volume to prevent overlap mud
      masterGain.connect(audioCtx.destination);
      console.log('✓ AudioContext created, master gain: 0.4');
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
      console.log('✓ AudioContext resumed');
    }
    return audioCtx;
  }

  function ensurePlayer() {
    if (!window.WebAudioFontPlayer) {
      console.error('WebAudioFontPlayer not loaded');
      return null;
    }
    if (!player) {
      player = new window.WebAudioFontPlayer();
    }
    return player;
  }

  function loadSound(soundKey) {
    return new Promise((resolve, reject) => {
      if (loadedFonts[soundKey]) {
        resolve(loadedFonts[soundKey]);
        return;
      }

      const sound = SOUNDS[soundKey];
      if (!sound) {
        console.error('❌ Sound config not found:', soundKey);
        reject('Sound not found');
        return;
      }

      if (loadingFonts[soundKey]) {
        const checkInterval = setInterval(() => {
          if (loadedFonts[soundKey]) {
            clearInterval(checkInterval);
            resolve(loadedFonts[soundKey]);
          }
        }, 50);
        return;
      }

      loadingFonts[soundKey] = true;
      const ctx = getAudioContext();
      const p = ensurePlayer();

      if (!p || !ctx) {
        console.error('❌ Player or context not ready');
        delete loadingFonts[soundKey];
        reject('Player not ready');
        return;
      }

      try {
        console.log('⏳ Loading:', soundKey, '→', sound.variable);
        p.loader.startLoad(ctx, sound.url, sound.variable);
        
        const timeout = setTimeout(() => {
          console.warn('⏱ Timeout loading', soundKey);
          delete loadingFonts[soundKey];
          reject('Load timeout');
        }, 5000);

        p.loader.waitLoad(() => {
          clearTimeout(timeout);
          const audioFont = window[sound.variable];
          
          if (audioFont) {
            loadedFonts[soundKey] = audioFont;
            console.log('✅ Loaded:', soundKey);
            resolve(audioFont);
          } else {
            console.error('❌ Variable missing:', sound.variable);
            const allKeys = Object.keys(window).filter(k => k.includes('drum') || k.includes('tone'));
            console.log('Available:', allKeys.slice(0, 5));
            delete loadingFonts[soundKey];
            reject('Variable not found');
          }
        });
      } catch (err) {
        console.error('❌ Error loading:', err);
        delete loadingFonts[soundKey];
        reject(err);
      }
    });
  }

  // Stop all voices for a specific note (prevents overlapping)
  function stopNote(soundKey, pitch) {
    const p = ensurePlayer();
    const ctx = getAudioContext();
    if (p && ctx && audioCtx) {
      try {
        p.cancelQueue(ctx); // Simple approach - cancel scheduled but not playing
      } catch (e) {}
    }
  }

  // Play note with proper envelope and master gain
  function playNote(soundKey, pitch, volume = 0.5, duration = 0.8) {
    return new Promise(async (resolve) => {
      try {
        const ctx = getAudioContext();
        const p = ensurePlayer();
        if (!p) { resolve(); return; }
        if (!masterGain) { resolve(); return; }

        const audioFont = await loadSound(soundKey);
        if (!audioFont) { resolve(); return; }

        const adjustedVolume = Math.min(volume, 1.0);

        // For drums, force MIDI pitch to 60 (standard drum pitch)
        const isdrums = soundKey.includes('kick') || soundKey.includes('snare') || 
                        soundKey.includes('hihat') || soundKey.includes('crash');
        const midiPitch = isdrums ? 60 : pitch;

        console.log(`🔊 Playing ${soundKey} | pitch: ${midiPitch} | vol: ${adjustedVolume.toFixed(2)} | dur: ${duration.toFixed(2)}s`);

        const voice = p.queueWaveTable(
          ctx,
          masterGain,
          audioFont,
          0,
          midiPitch,
          duration,
          adjustedVolume
        );

        resolve(voice);
      } catch (err) {
        console.error('Error playing:', soundKey, err);
        resolve();
      }
    });
  }

  // Preload sounds for an instrument
  async function preloadInstrument(inst) {
    if (inst === 'drums') {
      const drumSounds = DRUM_PADS.map(p => p.sound);
      await Promise.all(drumSounds.map(s => loadSound(s)));
    } else {
      await loadSound(inst);
    }
  }

  // ============================================================
  // NOTE HANDLING
  // ============================================================
  const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

  function getSoundKey(instrument) {
    if (instrument === 'piano') return 'piano';
    if (instrument === 'flute') return 'flute';
    if (instrument === 'guitar') return 'guitar';
    return 'piano';
  }

  // Note durations - keep very short to avoid overlap and muddy sound
  const NOTE_DURATIONS = {
    piano: 0.5,    // Short and crisp
    flute: 0.6,    // Slightly longer
    guitar: 0.4,   // Quick pluck
    drums: 0.5     // Longer for better drum sound
  };

  function midiToNoteName(midi) {
    const note = noteNames[midi % 12];
    const oct = Math.floor(midi / 12) - 1;
    return `${note}${oct}`;
  }

  function handleNoteOn(midiNote) {
    const soundKey = getSoundKey(currentInstrument);
    const duration = NOTE_DURATIONS[currentInstrument] || 0.5;

    playNote(soundKey, midiNote, 0.9, duration);

    if (isRecording) {
      const t = (performance.now() - recordStartTime) / 1000;
      activeNoteStarts[`${currentInstrument}-${midiNote}`] = t;
    }

    activeNotes.add(midiNote);
    updateLastPlayed(midiToNoteName(midiNote));
    renderPianoKeyboard();
  }

  function handleNoteOff(midiNote) {
    if (isRecording) {
      const key = `${currentInstrument}-${midiNote}`;
      const startTime = activeNoteStarts[key];
      if (startTime !== undefined) {
        delete activeNoteStarts[key];
        const endTime = (performance.now() - recordStartTime) / 1000;
        recordNotes.push({
          id: `${key}-${startTime}`,
          instrument: currentInstrument,
          noteIndex: midiNote,
          time: startTime,
          duration: Math.max(endTime - startTime, 0.1)
        });
      }
    }

    activeNotes.delete(midiNote);
    renderPianoKeyboard();
  }

  function handleDrumHit(padIndex, isMouseDown = true) {
    const pad = DRUM_PADS[padIndex];
    if (!pad) return;

    if (isMouseDown && !activeDrumPads.has(padIndex)) {
      // First press - store start time
      playNote(pad.sound, 60, 1.0, NOTE_DURATIONS.drums);
      
      if (isRecording) {
        const t = (performance.now() - recordStartTime) / 1000;
        activeDrumPadStartTimes[padIndex] = {
          startTime: t,
          padName: pad.name
        };
      }

      activeDrumPads.add(padIndex);
      updateLastPlayed(pad.name);
      renderDrumPads();
    } else if (!isMouseDown && activeDrumPads.has(padIndex)) {
      // Mouse up - end recording and remove from active
      if (isRecording && activeDrumPadStartTimes[padIndex]) {
        const t = (performance.now() - recordStartTime) / 1000;
        const startData = activeDrumPadStartTimes[padIndex];
        recordNotes.push({
          id: `drums-${padIndex}-${startData.startTime}`,
          instrument: 'drums',
          noteIndex: padIndex,
          time: startData.startTime,
          duration: Math.max(t - startData.startTime, 0.1)
        });
        delete activeDrumPadStartTimes[padIndex];
      }
      
      activeDrumPads.delete(padIndex);
      renderDrumPads();
    }
  }

  // ============================================================
  // KEYBOARD HANDLING
  // ============================================================
  function getMidi(noteIdx, oct) {
    return (oct + 1) * 12 + noteIdx;
  }

  document.addEventListener('keydown', (e) => {
    if (e.repeat) return;
    const k = e.key.toLowerCase();
    if (pressedKeys.has(k)) return;
    pressedKeys.add(k);

    if (currentInstrument === 'drums') {
      const idx = DRUM_PADS.findIndex(p => p.key === k);
      if (idx >= 0) handleDrumHit(idx, true);
    } else {
      const idx1 = OCTAVE_KEYS.findIndex(o => o.kb === k);
      if (idx1 >= 0) {
        handleNoteOn(getMidi(idx1, currentOctave));
        return;
      }
      const idx2 = OCTAVE2_KEYS[k];
      if (idx2 !== undefined) {
        handleNoteOn(getMidi(idx2, currentOctave + 1));
      }
    }
  });

  document.addEventListener('keyup', (e) => {
    const k = e.key.toLowerCase();
    pressedKeys.delete(k);

    if (currentInstrument === 'drums') {
      const idx = DRUM_PADS.findIndex(p => p.key === k);
      if (idx >= 0) handleDrumHit(idx, false);
    } else {
      const idx1 = OCTAVE_KEYS.findIndex(o => o.kb === k);
      if (idx1 >= 0) {
        handleNoteOff(getMidi(idx1, currentOctave));
        return;
      }
      const idx2 = OCTAVE2_KEYS[k];
      if (idx2 !== undefined) {
        handleNoteOff(getMidi(idx2, currentOctave + 1));
      }
    }
  });

  // ============================================================
  // RENDERING
  // ============================================================
  function renderPianoKeyboard() {
    const container = document.getElementById('pianoKeyboard');
    if (!container) return;
    container.innerHTML = '';

    [currentOctave, currentOctave + 1].forEach((oct, octIdx) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'piano-octave-wrapper';

      const label = document.createElement('div');
      label.className = 'piano-octave-label';
      label.textContent = `Oitava ${oct + 1}`;
      wrapper.appendChild(label);

      const octaveDiv = document.createElement('div');
      octaveDiv.className = 'piano-octave';

      const whites = OCTAVE_KEYS.filter(o => !o.isBlack);
      const blacks = OCTAVE_KEYS.filter(o => o.isBlack);
      const ww = 100 / whites.length;
      const blackOffsets = [0.6, 1.6, 3.6, 4.6, 5.6];

      whites.forEach((o, i) => {
        const idx = OCTAVE_KEYS.indexOf(o);
        const midi = getMidi(idx, oct);
        const key = document.createElement('div');
        key.className = `piano-key white-key ${activeNotes.has(midi) ? 'active' : ''}`;
        key.style.width = `${ww}%`;

        const kbHints = ['z', 'x', 'c', 'v', 'b', 'n', 'm'];
        key.innerHTML = `
          <span class="key-label white-key-label">
            <span class="note-name">${o.note}</span>
            <span class="kb-hint">${octIdx === 0 ? o.kb : kbHints[i] || ''}</span>
          </span>
        `;
        key.addEventListener('mousedown', () => handleNoteOn(midi));
        key.addEventListener('mouseup', () => handleNoteOff(midi));
        key.addEventListener('mouseleave', () => activeNotes.has(midi) && handleNoteOff(midi));
        key.addEventListener('touchstart', (e) => { e.preventDefault(); handleNoteOn(midi); });
        key.addEventListener('touchend', (e) => { e.preventDefault(); handleNoteOff(midi); });
        octaveDiv.appendChild(key);
      });

      blacks.forEach((o, i) => {
        const idx = OCTAVE_KEYS.indexOf(o);
        const midi = getMidi(idx, oct);
        const key = document.createElement('div');
        key.className = `piano-key black-key ${activeNotes.has(midi) ? 'active' : ''}`;
        key.style.left = `${blackOffsets[i] * ww}%`;
        key.style.width = `${ww * 0.65}%`;

        const bkHints = ['s', 'd', 'g', 'h', 'j'];
        key.innerHTML = `<span class="key-label black-key-label">${octIdx === 0 ? o.kb : bkHints[i] || ''}</span>`;
        key.addEventListener('mousedown', (e) => { e.stopPropagation(); handleNoteOn(midi); });
        key.addEventListener('mouseup', (e) => { e.stopPropagation(); handleNoteOff(midi); });
        key.addEventListener('mouseleave', () => activeNotes.has(midi) && handleNoteOff(midi));
        key.addEventListener('touchstart', (e) => { e.preventDefault(); handleNoteOn(midi); });
        key.addEventListener('touchend', (e) => { e.preventDefault(); handleNoteOff(midi); });
        octaveDiv.appendChild(key);
      });

      wrapper.appendChild(octaveDiv);
      container.appendChild(wrapper);
    });
  }

  function renderDrumPads() {
    const grid = document.getElementById('drumGrid');
    if (!grid) return;
    grid.innerHTML = '';

    DRUM_PADS.forEach((pad, idx) => {
      const btn = document.createElement('button');
      btn.className = `drum-pad drum-pad-${pad.size} ${activeDrumPads.has(idx) ? 'active' : ''}`;
      btn.style.setProperty('--pad-color', pad.color);
      btn.innerHTML = `
        <span class="drum-pad-name">${pad.name}</span>
        <span class="drum-pad-key">${pad.key.toUpperCase()}</span>
      `;
      btn.addEventListener('mousedown', () => handleDrumHit(idx, true));
      btn.addEventListener('mouseup', () => handleDrumHit(idx, false));
      btn.addEventListener('mouseleave', () => { if (activeDrumPads.has(idx)) handleDrumHit(idx, false); });
      btn.addEventListener('touchstart', (e) => { e.preventDefault(); handleDrumHit(idx, true); });
      btn.addEventListener('touchend', (e) => { e.preventDefault(); handleDrumHit(idx, false); });
      grid.appendChild(btn);
    });
  }

  function renderTracks() {
    const list = document.getElementById('trackList');
    const empty = document.getElementById('emptyState');
    if (!list) return;

    if (tracks.length === 0) {
      empty.style.display = 'flex';
      list.querySelectorAll('.track-row, .timeline-bar').forEach(el => el.remove());
      document.getElementById('studioSub').textContent = '0 faixas';
      document.getElementById('timeTotal').textContent = '0:00.0';
      return;
    }

    empty.style.display = 'none';
    list.querySelectorAll('.track-row, .timeline-bar').forEach(el => el.remove());

    const maxDur = Math.max(...tracks.map(t => t.duration), 0.1);
    document.getElementById('timeTotal').textContent = formatTime(maxDur);

    tracks.forEach((track, ti) => {
      const row = document.createElement('div');
      row.className = `track-row ${track.muted ? 'muted' : ''}`;

      const header = document.createElement('div');
      header.className = 'track-header';
      header.style.borderLeftColor = track.color;

      header.innerHTML = `
        <div class="track-info">
          <input class="track-name-input" value="${track.name}" data-track="${ti}" maxlength="20">
          <span class="track-inst-badge">${INST_LABELS[track.notes[0]?.instrument] || 'Instrumento'}</span>
        </div>
        <div class="track-controls">
          <button class="track-btn mute-btn ${track.muted ? 'muted' : ''}" data-track="${ti}" data-action="mute">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              ${track.muted
                ? '<path d="M11 5L6 9H2v6h4l5 4V5z"/><line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>'
                : '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>'}
            </svg>
          </button>
          <button class="track-btn delete-btn" data-track="${ti}" data-action="delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
            </svg>
          </button>
        </div>
        <div class="track-volume">
          <input type="range" class="volume-slider" min="0" max="1" step="0.05" value="${track.volume}" data-track="${ti}" data-action="volume">
        </div>
      `;

      const timeline = document.createElement('div');
      timeline.className = 'track-timeline';

      track.notes.forEach(note => {
        const block = document.createElement('div');
        block.className = 'note-block';
        block.style.left = `${(note.time / maxDur) * 100}%`;
        block.style.width = `${Math.max((note.duration / maxDur) * 100, 0.3)}%`;
        block.style.backgroundColor = track.color;
        block.style.opacity = track.muted ? '0.3' : '0.85';
        timeline.appendChild(block);
      });

      row.appendChild(header);
      row.appendChild(timeline);
      list.appendChild(row);
    });

    const bar = document.createElement('div');
    bar.className = 'timeline-bar';
    bar.innerHTML = `<div class="timeline-progress" id="timelineProgress" style="width:0%"></div>`;
    list.appendChild(bar);

    document.getElementById('studioSub').textContent = `${tracks.length} ${tracks.length === 1 ? 'faixa' : 'faixas'}`;

    list.querySelectorAll('.track-name-input').forEach(input => {
      input.addEventListener('change', (e) => {
        tracks[parseInt(e.target.dataset.track)].name = e.target.value;
      });
    });
    list.querySelectorAll('.mute-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const ti = parseInt(e.currentTarget.dataset.track);
        tracks[ti].muted = !tracks[ti].muted;
        renderTracks();
      });
    });
    list.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        tracks.splice(parseInt(e.currentTarget.dataset.track), 1);
        renderTracks();
      });
    });
    list.querySelectorAll('.volume-slider').forEach(slider => {
      slider.addEventListener('input', (e) => {
        tracks[parseInt(e.target.dataset.track)].volume = parseFloat(e.target.value);
      });
    });
  }

  function updateLastPlayed(name) {
    const el = document.getElementById('lastPlayed');
    const noteEl = document.getElementById('lastPlayedNote');
    if (el && noteEl) {
      el.style.display = 'flex';
      noteEl.textContent = name;
    }
  }

  // ============================================================
  // CONTROLS
  // ============================================================
  function setInstrument(inst) {
    currentInstrument = inst;
    document.querySelectorAll('.inst-tab').forEach(tab => {
      tab.classList.toggle('active', tab.dataset.instrument === inst);
    });
    document.getElementById('pianoContainer').style.display = inst === 'drums' ? 'none' : 'flex';
    document.getElementById('drumsContainer').style.display = inst === 'drums' ? 'flex' : 'none';
    document.getElementById('octaveControl').style.display = inst === 'drums' ? 'none' : 'flex';
    if (inst !== 'drums') renderPianoKeyboard();
    preloadInstrument(inst);
  }

  function setOctave(oct) {
    currentOctave = Math.max(0, Math.min(6, oct));
    document.getElementById('octaveDisplay').textContent = currentOctave + 1;
    renderPianoKeyboard();
  }

  function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', theme);
  }

  function toggleRecording() {
    const btn = document.getElementById('recordBtn');
    const ind = document.getElementById('recordingIndicator');

    if (isRecording) {
      isRecording = false;
      btn.classList.remove('recording');
      btn.querySelector('span').textContent = 'Gravar';
      btn.querySelector('svg').innerHTML = '<circle cx="12" cy="12" r="10"/>';
      ind.style.display = 'none';

      const now = (performance.now() - recordStartTime) / 1000;
      Object.keys(activeNoteStarts).forEach((key) => {
        const startTime = activeNoteStarts[key];
        const [inst, idx] = key.split('-');
        recordNotes.push({
          id: `${key}-${startTime}`,
          instrument: inst,
          noteIndex: parseInt(idx),
          time: startTime,
          duration: Math.max(now - startTime, 0.1)
        });
      });
      Object.keys(activeNoteStarts).forEach(k => delete activeNoteStarts[k]);
      Object.keys(activeDrumPadStartTimes).forEach((idx) => {
        const startData = activeDrumPadStartTimes[idx];
        recordNotes.push({
          id: `drums-${idx}-${startData.startTime}`,
          instrument: 'drums',
          noteIndex: parseInt(idx),
          time: startData.startTime,
          duration: Math.max(now - startData.startTime, 0.1)
        });
      });
      Object.keys(activeDrumPadStartTimes).forEach(k => delete activeDrumPadStartTimes[k]);

      if (recordNotes.length > 0) {
        tracks.push({
          id: Date.now().toString(),
          name: `Faixa ${tracks.length + 1}`,
          notes: [...recordNotes],
          duration: now,
          color: TRACK_COLORS[tracks.length % TRACK_COLORS.length],
          muted: false,
          volume: 1
        });
        renderTracks();
      }
      recordNotes = [];
    } else {
      isRecording = true;
      recordStartTime = performance.now();
      recordNotes = [];
      Object.keys(activeNoteStarts).forEach(k => delete activeNoteStarts[k]);
      Object.keys(activeDrumPadStartTimes).forEach(k => delete activeDrumPadStartTimes[k]);
      btn.classList.add('recording');
      btn.querySelector('span').textContent = 'Parar Grav.';
      btn.querySelector('svg').innerHTML = '<rect x="6" y="6" width="12" height="12"/>';
      ind.style.display = 'flex';
    }
  }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    const ms = Math.floor((s % 1) * 10);
    return `${m}:${sec.toString().padStart(2, '0')}.${ms}`;
  }

  function stopPlayback() {
    playbackActive = false;
    const btn = document.getElementById('playBtn');
    btn.querySelector('span').textContent = 'Reproduzir';
    btn.querySelector('svg').innerHTML = '<polygon points="5 3 19 12 5 21 5 3"/>';
    renderTracks();
  }

  function startPlayback() {
    if (tracks.length === 0) return;

    playbackActive = true;
    const btn = document.getElementById('playBtn');
    btn.querySelector('span').textContent = 'Parar';
    btn.querySelector('svg').innerHTML = '<rect x="6" y="6" width="12" height="12"/>';

    const maxDur = Math.max(...tracks.map(t => t.duration), 0.1);
    let startTime = null;

    const scheduled = [];

    tracks.forEach((track) => {
      if (track.muted) return;
      track.notes.forEach(note => {
        scheduled.push({
          time: note.time * 1000,
          played: false,
          fn: () => {
            if (note.instrument === 'drums') {
              const pad = DRUM_PADS[note.noteIndex];
              if (pad) {
                // Use recorded duration for playback to maintain timing
                const duration = Math.max(note.duration, NOTE_DURATIONS.drums * 0.5);
                playNote(pad.sound, 60, track.volume * 0.95, duration);
              }
            } else {
              const soundKey = getSoundKey(note.instrument);
              const dur = NOTE_DURATIONS[note.instrument] || 0.5;
              playNote(soundKey, note.noteIndex, track.volume * 0.85, Math.min(note.duration, dur));
            }
          }
        });
      });
    });

    scheduled.sort((a, b) => a.time - b.time);

    function tick(ts) {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;

      scheduled.forEach(item => {
        if (!item.played && item.time <= elapsed) {
          item.fn();
          item.played = true;
        }
      });

      const sec = elapsed / 1000;
      document.getElementById('timeDisplay').textContent = formatTime(Math.min(sec, maxDur));
      const progEl = document.getElementById('timelineProgress');
      if (progEl) progEl.style.width = `${Math.min(sec / maxDur, 1) * 100}%`;

      if (elapsed >= maxDur * 1000 + 200) {
        stopPlayback();
        document.getElementById('timeDisplay').textContent = formatTime(0);
        return;
      }

      requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }

  function togglePlayback() {
    if (playbackActive) {
      stopPlayback();
    } else {
      startPlayback();
    }
  }

  function clearAll() {
    tracks.length = 0;
    renderTracks();
    document.getElementById('timeDisplay').textContent = '0:00.0';
    document.getElementById('timeTotal').textContent = '0:00.0';
  }

  // ============================================================
  // INIT
  // ============================================================
  function init() {
    console.log('WoodKeys Studio initializing...');

    document.querySelectorAll('.inst-tab').forEach(tab => {
      tab.addEventListener('click', () => setInstrument(tab.dataset.instrument));
    });

    document.getElementById('octaveDown').addEventListener('click', () => setOctave(currentOctave - 1));
    document.getElementById('octaveUp').addEventListener('click', () => setOctave(currentOctave + 1));

    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    document.getElementById('recordBtn').addEventListener('click', toggleRecording);
    document.getElementById('playBtn').addEventListener('click', togglePlayback);
    document.getElementById('clearBtn').addEventListener('click', clearAll);

    renderPianoKeyboard();
    renderDrumPads();
    renderTracks();

    preloadInstrument('piano');

    console.log('WoodKeys Studio ready!');
  }

  function waitForWebAudioFont() {
    if (window.WebAudioFontPlayer) {
      init();
    } else {
      setTimeout(waitForWebAudioFont, 100);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForWebAudioFont);
  } else {
    waitForWebAudioFont();
  }
})();
