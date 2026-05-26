# 🎹 Tung Tung Sol Lá Sí

Um estúdio musical interativo desenvolvido com JavaScript Vanilla, Web Audio API e WebAudioFont.
O projeto permite tocar instrumentos em tempo real, utilizar drum pads, gravar tracks, reproduzir sequências e alternar entre diferentes instrumentos diretamente no navegador.

---

# ✨ Features

* 🎹 Piano virtual interativo
* 🥁 Drum pads funcionais
* 🎸 Suporte para múltiplos instrumentos
* ⏺️ Sistema de gravação de tracks
* ▶️ Reprodução timeline/sequencer
* 🎚️ Controle de volume individual
* 🌙 Tema Dark/Light
* 📱 Interface responsiva
* ⚡ Sem frameworks
* 🔊 Áudio em tempo real

---

# 📂 Estrutura do Projeto

```txt
project/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

---

# 🚀 Tecnologias Utilizadas

| Tecnologia         | Função                     |
| ------------------ | -------------------------- |
| HTML5              | Estrutura da aplicação     |
| CSS3               | Interface e responsividade |
| JavaScript Vanilla | Lógica do projeto          |
| Web Audio API      | Sistema de áudio           |
| WebAudioFont       | Instrumentos musicais      |

---

# 🔊 Sistema de Áudio

O projeto utiliza WebAudioFont para reproduzir instrumentos reais diretamente no navegador utilizando soundfonts.

CDN utilizada:

```html
<script src="https://surikov.github.io/webaudiofont/npm/dist/WebAudioFontPlayer.js"></script>
```

Os instrumentos são carregados dinamicamente através de arquivos `.sf2`.

Exemplo:

```js
const SOUNDS = {
  piano: {
    variable: '_tone_0000_JCLive_sf2_file',
    url: 'https://surikov.github.io/webaudiofontdata/sound/0000_JCLive_sf2_file.js'
  }
}
```

Cada instrumento possui:

* variável global
* soundfont
* sample de áudio
* notas MIDI

---

# 🎵 Reprodução de Notas

As notas são reproduzidas utilizando:

```js
queueWaveTable()
```

Esse método recebe:

* contexto de áudio
* instrumento carregado
* pitch MIDI
* duração
* volume

O sistema utiliza:

* AudioContext
* GainNode
* Buffers de áudio
* WaveTables

---

# 🎹 Piano Virtual

O teclado musical possui:

* duas oitavas
* suporte a mouse
* suporte a touch
* teclado físico QWERTY
* animações visuais
* teclas brancas e pretas

Mapeamento exemplo:

| Tecla | Nota |
| ----- | ---- |
| A     | C    |
| W     | C#   |
| S     | D    |
| E     | D#   |

Eventos utilizados:

```js
document.addEventListener('keydown')
document.addEventListener('keyup')
```

---

# 🥁 Drum Pads

A bateria virtual possui pads individuais para:

* kick
* snare
* hi-hat
* open hat
* crash

Cada pad possui:

* tecla própria
* sample individual
* cor personalizada
* efeito visual
* animação ao pressionar

Exemplo:

```js
{
  name: 'Bumbo',
  key: 'q',
  sound: 'kick'
}
```

---

# ⏺️ Sistema de Gravação

O projeto grava:

* instrumento utilizado
* nota MIDI
* tempo inicial
* duração da nota

Estrutura salva:

```js
{
  instrument,
  noteIndex,
  time,
  duration
}
```

Isso permite:

* reprodução posterior
* múltiplas tracks
* timeline
* sequenciamento

---

# ▶️ Sequencer / Playback

O sistema de reprodução utiliza:

```js
requestAnimationFrame()
```

As notas são organizadas por tempo e executadas na ordem correta.

O sequencer possui:

* timeline visual
* múltiplas tracks
* mute individual
* volume individual
* reprodução sincronizada

---

# 🎨 Sistema de CSS

O CSS foi desenvolvido utilizando:

* CSS Variables
* Design Tokens
* Gradients
* Shadows
* Glassmorphism leve
* Responsividade

O projeto utiliza temas dinâmicos:

```css
:root,
[data-theme="dark"]
```

Tema claro:

```css
[data-theme="light"]
```

Troca de tema:

```js
document.documentElement.setAttribute()
```

---

# 📱 Responsividade

O layout adapta automaticamente:

* teclado
* drum pads
* timeline
* controles
* header

Media queries utilizadas:

```css
@media (max-width: 900px)
```

---

# 🧠 Organização do Código

O projeto foi dividido em seções para facilitar manutenção:

## script.js

* CONFIG
* STATE
* AUDIO ENGINE
* NOTE HANDLING
* KEYBOARD HANDLING
* RENDERING
* CONTROLS
* INIT

---

## style.css

* DESIGN TOKENS
* LIGHT THEME
* APP LAYOUT
* CONTROLS BAR
* PIANO KEYBOARD
* DRUM PADS
* SEQUENCER
* RESPONSIVE

---

# ⚡ Performance

O projeto utiliza otimizações como:

* preload de instrumentos
* AudioContext único
* GainNode master
* controle de volume global
* carregamento assíncrono
* gerenciamento de notas ativas

---

# 📸 Imagens


### 1. Interface Principal

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/5bb5ec00-5764-4248-8d44-a3b590a0e5cc" />


### 2. Drum Pads

<img width="1217" height="373" alt="image" src="https://github.com/user-attachments/assets/c7009f5c-c91c-44b0-a470-0c7c2834a061" />


### 3. Tracks

<img width="1323" height="496" alt="image" src="https://github.com/user-attachments/assets/8433a853-dd43-497f-8045-54c5899465a8" />


### 4. Tema Light

<img width="1366" height="768" alt="image" src="https://github.com/user-attachments/assets/cbdd2754-46ab-4058-99d8-eeb3996916f1" />

### 5. Responsividade

<img width="299" height="549" alt="image" src="https://github.com/user-attachments/assets/c8cce31b-b8b7-4f0e-8abb-1cc86a9d9013" />


---

# 👨‍💻 Autor

João Pedro Cassanego Reichert.

