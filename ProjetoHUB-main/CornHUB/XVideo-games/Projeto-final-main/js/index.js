
// Chave usada para armazenar o saldo compartilhado entre as páginas.
const STORAGE_KEY = 'xvg_shared_balance';

// Pega o elemento que exibe o saldo no cabeçalho da página.
const balanceEl = document.getElementById('balance');
let balance = loadBalance();

// Formata número em moeda brasileira com duas casas decimais.
const fmt = v => v.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});

function loadBalance(){
  const stored = localStorage.getItem(STORAGE_KEY);
  if(!stored) return 2000.00;
  const value = parseFloat(stored.replace(',','.'));
  return isNaN(value) ? 2000.00 : value;
}

function saveBalance(v){
  localStorage.setItem(STORAGE_KEY, v.toFixed(2));
}

// Atualiza o saldo na interface e aplica uma animação breve.
function setBalance(v){
  balance = Math.max(0, v); // garante que o saldo não fique negativo.
  balanceEl.textContent = fmt(balance);
  saveBalance(balance);
  balanceEl.parentElement.animate(
    [{transform:'scale(1)'},{transform:'scale(1.08)'},{transform:'scale(1)'}],
    {duration:300}
  );
}

// Inicializa o saldo exibido com o valor compartilhado.
setBalance(balance);

// Trata o clique em cada botão de jogo.
document.querySelectorAll('.btn-play').forEach(btn=>{
  btn.addEventListener('click',()=>{
    const page = btn.dataset.page;

    // Se o botão tem página configurada, redireciona para o jogo.
    if(page){
      window.location.href = page;
      return;
    }

    // Caso contrário, executa um mini-jogo rápido na própria página.
    const game = btn.dataset.game;
    if(balance < 10){
      alert('Saldo insuficiente! Faça um depósito para continuar.');
      return;
    }

    const bet = 10;
    const win = Math.random() < 0.45;
    const payout = win ? bet * (1 + Math.random()*3) : 0;

    // Atualiza saldo com aposta e possível ganho.
    setBalance(balance - bet + payout);

    // Mostra o resultado após um pequeno atraso.
    setTimeout(()=>{
      if(win) alert(`🎉 ${game}: Você ganhou R$ ${fmt(payout)}!`);
      else alert(`${game}: Não foi dessa vez. Tente novamente!`);
    },50);
  });
});

// Abre prompt para o usuário inserir valor de depósito e aumenta o saldo.
document.getElementById('deposit').addEventListener('click',()=>{
  const v = prompt('Quanto deseja depositar? (R$)','100');
  const num = parseFloat((v||'').replace(',','.'));
  if(!isNaN(num) && num>0) setBalance(balance + num);
});
