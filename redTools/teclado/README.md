# 🎹 WoodBoard Studio

Um mini-estúdio musical no navegador com estética de **madeira**, modo **claro/escuro**, **4 instrumentos** (piano, flauta, violão, bateria) e **gravador estilo BandLab**.

Feito 100% com **HTML + CSS + JavaScript puro**. Os sons vêm direto do CDN do GitHub do projeto [WebAudioFont](https://surikov.github.io/webaudiofont/) — nenhum arquivo de áudio precisa ser baixado.

## ▶️ Como rodar (passo a passo bem fácil)

1. Crie uma pasta no seu computador, por exemplo `woodboard`.
2. Dentro dela, crie 3 arquivos e cole o conteúdo correspondente:
   - `index.html`
   - `style.css`
   - `script.js`
3. Dê **duplo clique** no `index.html`. Pronto — abre no navegador.

> Dica: alguns navegadores bloqueiam som até você clicar uma vez na página. Clique em qualquer tecla — depois disso, tudo funciona.

## 🎮 Como usar

| Ação | Como |
|------|------|
| Tocar nota | Clique na tecla **ou** use o teclado físico (`A S D F G H J` notas brancas, `W E T Y U` pretas) |
| Trocar instrumento | Menu no topo |
| Mudar oitava | Menu **Oitava** (3 a 6) |
| Trocar som do piano | Menu **Som do Piano** (Grand, Bright, Eletric) |
| Bateria | Teclas `Z X C V` (Bumbo, Caixa, Chimbal, Prato) |
| Modo claro/escuro | Botão 🌙/☀️ |
| **Gravar** | Clique em ⏺, toque sua música, clique de novo para parar |
| **Reproduzir** | ▶ — toca exatamente o que você gravou |
| **Editar** | Arraste os blocos na timeline para mover no tempo; clique com botão direito para apagar |
| Limpar tudo | 🗑 |

## 🔊 Como adicionar novos sons

O WebAudioFont tem **centenas** de instrumentos prontos. Para adicionar:

1. Vá em https://surikov.github.io/webaudiofont/ e escolha um instrumento. Copie a URL `.js` (ex.: `https://surikov.github.io/webaudiofontdata/sound/0480_Chaos_sf2_file.js`).
2. No `script.js`, encontre o objeto `PRESETS` e adicione:

```js
violino: [{ name:'_tone_0480_Chaos_sf2_file', url:'https://surikov.github.io/webaudiofontdata/sound/0480_Chaos_sf2_file.js' }],
```

3. No `index.html`, adicione uma opção no `<select id="instrument">`:

```html
<option value="violino">Violino</option>
```

Pronto — funciona automaticamente.

### Trocar por sons engraçados/personalizados

Se quiser usar **seus próprios** `.mp3`/`.wav` (vozes, efeitos):

```js
const meuSom = new Audio('sons/risada.mp3');
function tocarRisada(){ meuSom.currentTime=0; meuSom.play(); }
```

E chame `tocarRisada()` no clique da tecla.

## 🛡️ Por que não estoura o som?

Tudo passa por um `GainNode` (volume master a 60%) e um `DynamicsCompressor` que achata picos. Mesmo apertando 10 teclas juntas, o áudio fica limpo.

## 🚀 Publicar no GitHub Pages

1. Crie um repositório no GitHub e suba os 4 arquivos.
2. Vá em **Settings → Pages → Source: main / root**.
3. O link sai em segundos: `https://SEU-USUARIO.github.io/NOME-DO-REPO/`.

## 📂 Estrutura

```
woodboard/
├── index.html
├── style.css
├── script.js
└── README.md
```

Feito com ❤️ e madeira.
