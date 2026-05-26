# 🚀 Projeto CornHub

Este repositório reúne diversos projetos desenvolvidos utilizando HTML, CSS e JavaScript com foco em aprendizado, interatividade, manipulação de DOM, áudio, lógica de programação e experiência do usuário.

---

# 💡 Simulador de Interruptor

Um projeto interativo desenvolvido com HTML, CSS e JavaScript que simula um interruptor ligando e desligando uma lâmpada em um ambiente estilizado.

O sistema altera dinamicamente:

* iluminação da cena
* aparência do personagem
* estado visual do interruptor
* ambiente da página

Ideal para estudos de:

* DOM
* Eventos
* Manipulação de classes
* Interatividade com JavaScript

## 🖼️ Demonstração

### 💡 Luz acesa

`tung`

### 🌑 Luz apagada

`sahur`

## 🚀 Tecnologias Utilizadas

* HTML5
* CSS3
* JavaScript

## 📂 Estrutura do Projeto

```txt
simulador-interruptor/
│
├── index.html
├── README.md
│
├── css/
│   └── style.css
│
├── js/
│   └── script.js
│
└── img/
    ├── lampada-apagada.png
    └── lampada-acesa.png
```

---

# 🍅 Pomodoro Timer

Um cronômetro baseado na técnica Pomodoro para melhorar foco e produtividade.

## Sobre o método Pomodoro

A Técnica Pomodoro foi criada por Francesco Cirillo e consiste em dividir o tempo em ciclos:

* 25 minutos de foco total
* 5 minutos de pausa curta
* Após alguns ciclos: pausa maior

A ideia é evitar fadiga mental e aumentar a produtividade.

## ✨ Funcionalidades

✅ Temporizador de foco e descanso
✅ Iniciar, pausar e resetar
✅ Configuração personalizada dos tempos
✅ Alternância entre modo claro e escuro
✅ Som ao finalizar um ciclo
✅ Interface responsiva

## 🚀 Tecnologias utilizadas

* HTML5
* CSS3
* JavaScript

## 🖼️ Demonstração

Funcionamento

## ▶️ Como executar

Clone o projeto:

```bash
git clone https://github.com/seuusuario/pomodoro.git](https://github.com/joaojoaoGIT/ProjetoHUB/blob/main/redTools/pomodoro/README.md
```

Entre na pasta:

```bash
cd pomodoro
```

Abra:

```txt
index.html
```

## 🧠 Lógica usada no cronômetro

### setInterval()

O `setInterval()` executa uma função repetidamente em um intervalo de tempo.

Exemplo:

```javascript
intervaloId = setInterval(() => {
   tempoAtualSegundos--;
   atualizarDisplay();
},1000);
```

Fluxo:

```txt
Espera 1 segundo
↓
Diminui 1 segundo
↓
Atualiza tela
↓
Repete até parar
```

### clearInterval()

O `clearInterval()` interrompe a execução do intervalo.

Exemplo:

```javascript
clearInterval(intervaloId);
```

Foi utilizado em:

* Pausar cronômetro
* Resetar
* Quando o tempo chega em zero

Sem isso vários temporizadores seriam criados ao clicar em "Iniciar" várias vezes.

## Fluxo da lógica

```txt
Iniciar
   ↓
setInterval()
   ↓
tempo--
   ↓
Atualiza display
   ↓
Tempo chegou em 0?
   ↓
Sim → clearInterval()
   ↓
Troca Foco/Pausa
```

---

# 🎹 Tung Tung Sol Lá Sí

Um estúdio musical interativo desenvolvido com JavaScript Vanilla, Web Audio API e WebAudioFont.

O projeto permite:

* tocar instrumentos em tempo real
* utilizar drum pads
* gravar tracks
* reproduzir sequências
* alternar entre instrumentos diretamente no navegador

## ✨ Features

🎹 Piano virtual interativo
🥁 Drum pads funcionais
🎸 Suporte para múltiplos instrumentos
⏺️ Sistema de gravação de tracks
▶️ Reprodução timeline/sequencer
🎚️ Controle de volume individual
🌙 Tema Dark/Light
📱 Interface responsiva
⚡ Sem frameworks
🔊 Áudio em tempo real

## 📂 Estrutura do Projeto

```txt
project/
│
├── index.html
├── style.css
├── script.js
└── README.md
```

## 🚀 Tecnologias Utilizadas

| Tecnologia         | Função                     |
| ------------------ | -------------------------- |
| HTML5              | Estrutura da aplicação     |
| CSS3               | Interface e responsividade |
| JavaScript Vanilla | Lógica do projeto          |
| Web Audio API      | Sistema de áudio           |
| WebAudioFont       | Instrumentos musicais      |

## 🔊 Sistema de Áudio

O projeto utiliza WebAudioFont para reproduzir instrumentos reais diretamente no navegador utilizando soundfonts.

CDN:

```html
<script src="https://surikov.github.io/webaudiofont/npm/dist/WebAudioFontPlayer.js"></script>
```

Exemplo:

```javascript
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

## 🎵 Reprodução de Notas

Utiliza:

`queueWaveTable()`

Recebe:

* contexto de áudio
* instrumento carregado
* pitch MIDI
* duração
* volume

O sistema utiliza:

* AudioContext
* GainNode
* Buffers
* WaveTables

## 🎹 Piano Virtual

Possui:

* duas oitavas
* suporte a mouse
* suporte touch
* teclado físico QWERTY
* animações
* teclas brancas e pretas

Mapeamento:

| Tecla | Nota |
| ----- | ---- |
| A     | C    |
| W     | C#   |
| S     | D    |
| E     | D#   |

Eventos:

```javascript
document.addEventListener('keydown')
document.addEventListener('keyup')
```

## 🥁 Drum Pads

Pads:

* kick
* snare
* hi-hat
* open hat
* crash

Exemplo:

```javascript
{
  name:'Bumbo',
  key:'q',
  sound:'kick'
}
```

## ⏺️ Sistema de Gravação

Salva:

```javascript
{
  instrument,
  noteIndex,
  time,
  duration
}
```

Permite:

* reprodução posterior
* múltiplas tracks
* timeline
* sequenciamento

## ▶️ Sequencer / Playback

Utiliza:

```javascript
requestAnimationFrame()
```

Possui:

* timeline visual
* múltiplas tracks
* mute individual
* volume individual
* reprodução sincronizada

## 🎨 Sistema CSS

Utiliza:

* CSS Variables
* Design Tokens
* Gradients
* Shadows
* Glassmorphism
* Responsividade

Temas:

```css
:root,
[data-theme="dark"]
```

```css
[data-theme="light"]
```

Troca:

```javascript
document.documentElement.setAttribute()
```

## 📱 Responsividade

Media Query:

```css
@media (max-width:900px)
```

## 🧠 Organização do Código

### script.js

* CONFIG
* STATE
* AUDIO ENGINE
* NOTE HANDLING
* KEYBOARD HANDLING
* RENDERING
* CONTROLS
* INIT

### style.css

* DESIGN TOKENS
* LIGHT THEME
* APP LAYOUT
* CONTROLS BAR
* PIANO KEYBOARD
* DRUM PADS
* SEQUENCER
* RESPONSIVE

## ⚡ Performance

Otimizações:

* preload de instrumentos
* AudioContext único
* GainNode master
* volume global
* carregamento assíncrono
* gerenciamento de notas ativas

## 📸 Imagens

1. Interface Principal
2. Drum Pads
3. Tracks
4. Tema Light
5. Responsividade

## 👨‍💻 Autor

João Pedro Cassanego Reichert
