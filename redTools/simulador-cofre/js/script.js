const LS_KEY = 'cofre_estado_v1';

function carregarEstado() {
  try {
    const raw = localStorage.getItem(LS_KEY);

    if (raw) {
      return JSON.parse(raw);
    }

  } catch (e) {}

  return {
    saldo: 0,
    c10: 0,
    c25: 0,
    c50: 0,
    c100: 0
  };
}

let estado = carregarEstado();

function salvarEstado() {
  localStorage.setItem(LS_KEY, JSON.stringify(estado));
}

function formatarBRL(centavos) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(centavos / 100);
}

function totalMoedas() {
  return estado.c10 + estado.c25 + estado.c50 + estado.c100;
}

function atualizarCofre() {

  const max = 5000;

  const pct = Math.min(estado.saldo / max, 1);

  const alturaMax = 92;

  const altura = Math.round(pct * alturaMax);

  const rect = document.getElementById('cofre-enchimento');

  rect.setAttribute('y', 22 + alturaMax - altura);

  rect.setAttribute('height', altura);

  const angulo = pct * 300 - 150;

  const rad = angulo * Math.PI / 180;

  const cx = 65;
  const cy = 62;
  const r = 12;

  const x2 = (cx + r * Math.sin(rad)).toFixed(1);

  const y2 = (cy - r * Math.cos(rad)).toFixed(1);

  const ponteiro = document.getElementById('ponteiro');

  ponteiro.setAttribute('x2', x2);

  ponteiro.setAttribute('y2', y2);
}

function atualizar() {

  document.getElementById('saldo-display').textContent =
    formatarBRL(estado.saldo);

  document.getElementById('c10').textContent = estado.c10 + '×';

  document.getElementById('c25').textContent = estado.c25 + '×';

  document.getElementById('c50').textContent = estado.c50 + '×';

  document.getElementById('c100').textContent = estado.c100 + '×';

  const tm = totalMoedas();

  document.getElementById('total-moedas').textContent =
    tm + (tm === 1 ? ' moeda' : ' moedas');

  atualizarCofre();

  salvarEstado();
}

function bump() {

  const el = document.getElementById('saldo-display');

  el.classList.remove('bump');

  void el.offsetWidth;

  el.classList.add('bump');

  setTimeout(() => {
    el.classList.remove('bump');
  }, 200);
}

function mostrarMsg(texto, tipo) {

  const el = document.getElementById('mensagem');

  el.textContent = texto;

  el.className = 'msg ' + tipo;

  clearTimeout(el._t);

  el._t = setTimeout(() => {

    el.textContent = '';

    el.className = 'msg';

  }, 3500);
}

const coinStyles = {

  10: {
    bg: '#C8C0A8',
    border: '#A89878',
    color: '#5a4e38'
  },

  25: {
    bg: '#D4D4D4',
    border: '#B4B4B4',
    color: '#3a3a3a'
  },

  50: {
    bg: '#D4D4D4',
    border: '#B4B4B4',
    color: '#3a3a3a'
  },

  100: {
    bg: '#D4A43C',
    border: '#C08820',
    color: '#5a3a00'
  }
};

function animarMoeda(centavos, btnEl) {

  const stage = document.getElementById('coin-stage');

  const stageRect = stage.getBoundingClientRect();

  const btnRect = btnEl.getBoundingClientRect();

  const startX =
    btnRect.left + btnRect.width / 2 - stageRect.left - 16;

  const startY =
    btnRect.top - stageRect.top - 16;

  const style = coinStyles[centavos];

  const label = centavos === 100
    ? 'R$1'
    : centavos + '¢';

  const coin = document.createElement('div');

  coin.className = 'animated-coin';

  coin.style.cssText = `
    left:${startX}px;
    top:${startY}px;
    width:32px;
    height:32px;
    background:${style.bg};
    border:3px solid ${style.border};
    color:${style.color};
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:9px;
  `;

  coin.textContent = label;

  stage.appendChild(coin);

  coin.addEventListener('animationend', () => {
    coin.remove();
  });
}

function adicionarMoeda(centavos, btnEl) {

  animarMoeda(centavos, btnEl);

  setTimeout(() => {

    estado.saldo += centavos;

    estado['c' + centavos]++;

    bump();

    atualizar();

  }, 1);
}

function sacar() {

  if (estado.saldo === 0) {

    mostrarMsg('Cofre vazio!', 'erro');

    return;
  }

  const input = document.getElementById('valor-saque');

  const raw = parseFloat(input.value);

  if (!raw || raw <= 0) {

    mostrarMsg('Informe um valor válido.', 'erro');

    return;
  }

  const centavos = Math.round(raw * 100);

  if (centavos > estado.saldo) {

    mostrarMsg('Saldo insuficiente!', 'erro');

    return;
  }

  estado.saldo -= centavos;

  input.value = '';

  mostrarMsg(
    'Saque de ' + formatarBRL(centavos) + ' realizado!',
    'ok'
  );

  bump();

  atualizar();
}

function esvaziar() {

  estado = {
    saldo: 0,
    c10: 0,
    c25: 0,
    c50: 0,
    c100: 0
  };

  mostrarMsg('Cofre esvaziado!', 'ok');

  atualizar();
}

atualizar();