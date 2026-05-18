
// Lista de imagens de dados para cada face do dado.
const diceImages = [
    "assets/img/png1.com.png",
    "assets/img/png2.com.png",
    "assets/img/png3.com.png",
    "assets/img/png4.com.png",
    "assets/img/png5.com.png",
    "assets/img/png6.com.png"
];

const STORAGE_KEY = 'xvg_shared_balance';

function loadBalance(){
    const stored = localStorage.getItem(STORAGE_KEY);
    if(!stored) return 2000;
    const value = parseFloat(stored.replace(',','.'));
    return isNaN(value) ? 2000 : value;
}

function saveBalance(value){
    localStorage.setItem(STORAGE_KEY, value.toFixed(2));
}

// Seleção de elementos do DOM usados pelo jogo.
const playerImg = document.getElementById("dice-player");
const statusPlayer = document.getElementById("status-player");
const message = document.getElementById("message");
const rollButton = document.getElementById("roll-button");
const numberButtons = document.querySelectorAll(".number-btn");
const chosenNumberDisplay = document.getElementById("chosen-number");
const betInput = document.getElementById("bet-input");
const betAllButton = document.getElementById("bet-all-button");
const quickBetButtons = document.querySelectorAll(".quick-bet-btn:not(#bet-all-button)");
const saldoDisplay = document.getElementById("saldo");
const historyList = document.getElementById("history-list");

// Estado interno do jogo.
let saldo = loadBalance();
let chosenNumber = null;
let betAmount = 0;

// Atualiza o saldo exibido na tela e define o valor máximo do input de aposta.
function updateSaldoDisplay() {
    saldoDisplay.textContent = saldo.toFixed(2);
    betInput.max = saldo;
    saveBalance(saldo);
}

// Adiciona um registro ao histórico de apostas.
function addHistoryEntry(chosenNumber, rolledValue, betAmount, won) {
    if (!historyList) return;

    const emptyText = historyList.querySelector(".empty-state");
    if (emptyText) {
        emptyText.remove();
    }

    const entry = document.createElement("div");
    entry.className = "history-entry";
    entry.innerHTML = `
        <div class="history-entry-top ${won ? "win" : "loss"}">
            <span>${won ? "Vitória" : "Derrota"}</span>
            <span class="history-amount">R$ ${betAmount.toFixed(2)}</span>
        </div>
        <p>Escolhido: <strong>${chosenNumber}</strong> · Número sorteado: <strong>${rolledValue}</strong></p>
    `;
    historyList.prepend(entry);
}

// Permite que o jogador selecione um número antes de apostar.
numberButtons.forEach(button => {
    button.addEventListener("click", function() {
        numberButtons.forEach(btn => btn.classList.remove("selected"));
        this.classList.add("selected");
        chosenNumber = parseInt(this.dataset.number, 10);
        chosenNumberDisplay.textContent = `Número escolhido: ${chosenNumber}`;
    });
});

// Ajusta o valor de aposta a partir dos botões rápidos.
quickBetButtons.forEach(button => {
    button.addEventListener("click", function() {
        const amount = parseInt(this.dataset.amount, 10);
        if (amount) {
            betInput.value = amount;
            quickBetButtons.forEach(btn => btn.classList.remove("active"));
            this.classList.add("active");
        }
    });
});

// Define o input de aposta como "tudo" quando o usuário clica em apostar tudo.
betAllButton.addEventListener("click", function() {
    betInput.value = saldo;
    quickBetButtons.forEach(btn => btn.classList.remove("active"));
});

// Gera um valor aleatório de 1 a 6 representando o dado.
function rollDie() {
    return Math.floor(Math.random() * 6) + 1;
}

// Atualiza a imagem do dado exibida com base no valor sorteado.
function updateDiceImages(imgElement, value) {
    imgElement.src = diceImages[value - 1];
    imgElement.alt = `Dado mostrando ${value}`;
}

// Executa uma rodada completa de aposta.
function playRound() {
    if (chosenNumber === null) {
        message.textContent = "Escolha um número de 1 a 6!";
        return;
    }

    betAmount = parseFloat(betInput.value);
    if (!betAmount || betAmount <= 0) {
        message.textContent = "Digite um valor para apostar!";
        return;
    }
    if (betAmount > saldo) {
        message.textContent = "Você não tem saldo suficiente!";
        return;
    }

    // Desabilita controles durante a animação do lançamento.
    rollButton.disabled = true;
    numberButtons.forEach(btn => btn.disabled = true);
    betInput.disabled = true;
    betAllButton.disabled = true;

    playerImg.classList.add("rolling");

    // Mostra faces de dado alternadas enquanto roda.
    const rollInterval = setInterval(() => {
        updateDiceImages(playerImg, rollDie());
    }, 100);

    // Após o tempo de rolagem, define o resultado final.
    setTimeout(() => {
        clearInterval(rollInterval);
        const rolledValue = rollDie();
        playerImg.classList.remove("rolling");
        playerImg.classList.remove("winner", "loser");
        updateDiceImages(playerImg, rolledValue);

        if (rolledValue === chosenNumber) {
            saldo += betAmount * 2.3;
            playerImg.classList.add("winner");
            statusPlayer.textContent = `Você acertou! +R$ ${betAmount.toFixed(2)}`;
            message.textContent = `🎉 Parabéns! Você ganhou R$ ${betAmount.toFixed(2)}`;
            addHistoryEntry(chosenNumber, rolledValue, betAmount, true);
        } else {
            saldo -= betAmount;
            playerImg.classList.add("loser");
            statusPlayer.textContent = `Errou! -R$ ${betAmount.toFixed(2)}. Número: ${rolledValue}`;
            addHistoryEntry(chosenNumber, rolledValue, betAmount, false);
            if (saldo <= 0) {
                saldo = 0;
                message.textContent = "💀 Seu saldo zerou. Deposite para continuar jogando.";
            } else {
                message.textContent = `😢 Você perdeu R$ ${betAmount.toFixed(2)}. O número foi ${rolledValue}`;
            }
        }

        updateSaldoDisplay();
        rollButton.disabled = false;
        numberButtons.forEach(btn => btn.disabled = false);
        betInput.disabled = false;
        betAllButton.disabled = false;
        quickBetButtons.forEach(btn => btn.classList.remove("active"));
        betInput.value = "";
    }, 800);
}

// Associar o clique do botão de rolar ao início de uma rodada.
rollButton.addEventListener("click", playRound);

// ===== DEPOSITO =====
const depositButton = document.getElementById("deposit-button");
const depositModal = document.getElementById("deposit-modal");
const closeModal = document.getElementById("close-modal");
const methodButtons = document.querySelectorAll(".method-btn");
const depositAmountInput = document.getElementById("deposit-amount");
const quickAmountButtons = document.querySelectorAll(".quick-amount");
const confirmDepositBtn = document.getElementById("confirm-deposit");
const totalAmountDisplay = document.getElementById("total-amount");
const modalMessage = document.getElementById("modal-message");
let selectedMethod = "cartao";

// Abre o modal de depósito.
if (depositButton) {
    depositButton.addEventListener("click", function() {
        depositModal.classList.add("open");
        depositAmountInput.value = "";
        updateTotalAmount();
    });
}

// Fecha o modal e limpa mensagens.
closeModal.addEventListener("click", function() {
    depositModal.classList.remove("open");
    modalMessage.classList.remove("success", "error");
    modalMessage.textContent = "";
});

depositModal.addEventListener("click", function(e) {
    if (e.target === depositModal) {
        depositModal.classList.remove("open");
        modalMessage.classList.remove("success", "error");
    }
});

// Seleciona o método de pagamento.
methodButtons.forEach(button => {
    button.addEventListener("click", function() {
        methodButtons.forEach(btn => btn.classList.remove("selected"));
        this.classList.add("selected");
        selectedMethod = this.dataset.method;
    });
});

// Ajusta valor rápido de depósito.
quickAmountButtons.forEach(button => {
    button.addEventListener("click", function() {
        const amount = parseFloat(this.dataset.amount);
        depositAmountInput.value = amount.toFixed(2);
        quickAmountButtons.forEach(btn => btn.classList.remove("active"));
        this.classList.add("active");
        updateTotalAmount();
    });
});

// Atualiza o valor exibido do total a depositar.
function updateTotalAmount() {
    const amount = parseFloat(depositAmountInput.value) || 0;
    totalAmountDisplay.textContent = amount.toFixed(2);
}

depositAmountInput.addEventListener("input", function() {
    quickAmountButtons.forEach(btn => btn.classList.remove("active"));
    updateTotalAmount();
});

// Valida e processa o depósito.
confirmDepositBtn.addEventListener("click", function() {
    const amount = parseFloat(depositAmountInput.value);
    if (!amount || amount < 10) {
        showModalMessage("O depósito mínimo é R$ 10.00", "error");
        return;
    }
    if (amount > 10000) {
        showModalMessage("O depósito máximo é R$ 10.000.00", "error");
        return;
    }
    confirmDepositBtn.disabled = true;
    confirmDepositBtn.textContent = "Processando...";
    setTimeout(() => {
        saldo += amount;
        updateSaldoDisplay();
        showModalMessage(`✓ Depósito de R$ ${amount.toFixed(2)} realizado com sucesso!`, "success");
        setTimeout(() => {
            depositModal.classList.remove("open");
            depositAmountInput.value = "";
            totalAmountDisplay.textContent = "0.00";
            confirmDepositBtn.disabled = false;
            confirmDepositBtn.textContent = "Confirmar Depósito";
            modalMessage.classList.remove("success", "error");
            modalMessage.textContent = "";
        }, 1500);
    }, 1000);
});

function showModalMessage(text, type) {
    modalMessage.textContent = text;
    modalMessage.classList.remove("success", "error");
    modalMessage.classList.add(type);
}

// Inicializa o valor do saldo ao carregar a página.
updateSaldoDisplay();
