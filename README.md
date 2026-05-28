# 🚀 Projeto CornHub

## 📌 Navegação Rápida

- 💰 [Cofre Virtual](#-💰-Cofre-Virtual)
- 🎹 [Tung Tung Sol Lá Sí](#-tung-tung-sol-lá-sí)
- 🍅 [Pomodoro Sahur](#-Pomodoro-Sahur)
- 💡 [Simulador de Interruptor](#-simulador-de-interruptor)

---
# 💰 Cofre Virtual

Aplicação simples em HTML, CSS e JavaScript que simula um cofre de moedas, permitindo adicionar valores, sacar e acompanhar o saldo.

---

## 🧠 Lógica do Projeto

O sistema funciona baseado em um objeto chamado `estado`, que armazena:

- saldo total (em centavos)
- quantidade de moedas (10, 25, 50 e 100 centavos)

- 

### Funcionamento:

1. **Persistência de dados**
   - Utiliza `localStorage` para salvar o estado do cofre
   - Ao recarregar a página, os dados são restaurados

2. **Atualização da interface**
   - Sempre que uma ação ocorre (adicionar moeda, sacar, esvaziar), a função `atualizar()`:
     - Atualiza o saldo na tela
     - Atualiza contadores
     - Atualiza animações do cofre

3. **Cálculo do saldo**
   - O saldo é armazenado em centavos para evitar erros com números decimais
  
   - 
   🎨 Imagem exemplo
<img width="609" height="671" alt="Captura de tela 2026-05-26 144847" src="https://github.com/user-attachments/assets/bf709e1a-cce5-4496-8b80-42c580e4ce1a" />



---

## 💱 Como alterar a moeda (R$ → US$)

No arquivo `script.js`, localize a função:

```js
function formatarBRL(centavos) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(centavos / 100);
}
```

### Para dólar (US$), altere para:

```js
function formatarUSD(centavos) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(centavos / 100);
}
```

E substitua as chamadas de `formatarBRL` por `formatarUSD`.

---

## 📊 Sugestão de versão com gráficos (nível intermediário)

Você pode evoluir o projeto adicionando gráficos com a biblioteca **Chart.js**.

### Ideias:

- 📈 Gráfico de evolução do saldo ao longo do tempo
- 🪙 Gráfico de pizza mostrando distribuição de moedas
- 📊 Histórico de depósitos e saques

### Exemplo básico:

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<canvas id="grafico"></canvas>
```

```js
new Chart(document.getElementById('grafico'), {
  type: 'pie',
  data: {
    labels: ['10¢', '25¢', '50¢', 'R$1'],
    datasets: [{
      data: [estado.c10, estado.c25, estado.c50, estado.c100]
    }]
  }
});
```

---

## 🚀 Melhorias futuras

- Histórico completo de transações
- Exportar dados
- Modo escuro
- Suporte a múltiplas moedas

---

## 📁 Estrutura

```
cofre-repo/
├── index.html
├── style.css
├── script.js
└── README.md
```
- 🚀 [Voltar ao inicio](#-🚀-Projeto-CornHub)

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


- 🚀 [Voltar ao inicio](#-🚀-Projeto-CornHub)

# 🍅 Pomodoro Sahur

Um cronômetro baseado na técnica Pomodoro para melhorar foco e produtividade.

## Sobre o método Pomodoro

A Técnica Pomodoro foi criada por Francesco Cirillo e consiste em dividir o tempo em ciclos:

- 25 minutos de foco total
- 5 minutos de pausa curta
- Após alguns ciclos: pausa maior

A ideia é evitar fadiga mental e aumentar a produtividade.

---

## Funcionalidades

✅ Temporizador de foco e descanso  
✅ Iniciar, pausar e resetar  
✅ Configuração personalizada dos tempos  
✅ Alternância entre modo claro e escuro  
✅ Som ao finalizar um ciclo  
✅ Interface responsiva

---

## Tecnologias utilizadas

- HTML5
- CSS3
- JavaScript

---

## Demonstração

![Funcionamento](./assets/pomodoro-demo.gif)

---

## Como executar

Clone o projeto:

```bash
git clone https://github.com/seuusuario/pomodoro.git
```

Entre na pasta:

```bash
cd pomodoro
```

Abra:

```bash
index.html
```

---

## Lógica usada no cronômetro

### setInterval()

O `setInterval()` executa uma função repetidamente em um intervalo de tempo.

No projeto:

```javascript
intervaloId = setInterval(() => {
   tempoAtualSegundos--;
   atualizarDisplay();
},1000);
```

Ele executa a função a cada **1000ms (1 segundo)**.

Fluxo:

1. Espera 1 segundo
2. Diminui 1 segundo
3. Atualiza tela
4. Repete até parar

---

### clearInterval()

O `clearInterval()` interrompe a execução do intervalo.

Exemplo:

```javascript
clearInterval(intervaloId);
```

Foi utilizado em:

- Pausar cronômetro
- Resetar
- Quando o tempo chega em zero

Sem isso vários temporizadores seriam criados ao clicar em "Iniciar" várias vezes.

---

## Estrutura da lógica

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

- 🚀 [Voltar ao inicio](#-🚀-Projeto-CornHub)

  
# 💡 Simulador de Interruptor

Um projeto interativo desenvolvido com **HTML, CSS e JavaScript** que simula um interruptor ligando e desligando uma lâmpada em um ambiente estilizado.

O sistema altera dinamicamente:
- iluminação da cena
- aparência do personagem
- estado visual do interruptor
- ambiente da página

Ideal para estudos de:
- DOM
- Eventos
- Manipulação de classes
- Interatividade com JavaScript

---

# 🖼️ Demonstração

## 💡 Luz acesa

<img width="716" height="461" alt="Captura de tela 2026-05-28 141804" src="https://github.com/user-attachments/assets/dfa497e2-026f-49f9-9b45-ff2c10b019e3" />



---

## 🌑 Luz apagada


<img width="717" height="465" alt="Captura de tela 2026-05-28 141831" src="https://github.com/user-attachments/assets/9ae461ef-97d5-4c06-9be3-ff503d75d1cd" />

---
## 💡 Luz acesa
# 🚀 Tecnologias Utilizadas

- HTML5
- CSS3
- JavaScript

---

# 📂 Estrutura do Projeto

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
