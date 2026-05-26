const tempoElemento = document.getElementById('tempo');
const iniciarBotao = document.getElementById('iniciar');
const pausarBotao = document.getElementById('pausar');
const resetarBotao = document.getElementById('resetar');
const configurarBotao = document.getElementById('configurar');
const configuracoes = document.getElementById('configuracoes');
const salvarConfigBotao = document.getElementById('salvarConfig');
const tempoTrabalhoInput = document.getElementById('tempoTrabalho');
const tempoDescansoInput = document.getElementById('tempoDescanso');
const faseElemento = document.getElementById('fase');
const toggleTemaBotao = document.getElementById('toggleTema');
const bgVideo = document.getElementById('bg-video');
// caminhos dos vídeos (dia / noite)
const dayVideo = 'assets/PixVerse_V6_Image_Text_540P_anime_ele_mexendo_.mp4';
const nightVideo = 'assets/PixVerse_V6_Image_Text_540P_anime_ele_mexendonoite_.mp4';

let intervaloId = null;
let tempoAtualSegundos = 25 * 60;
let tempoTrabalho = 25 * 60;
let tempoDescanso = 5 * 60;
let emExecucao = false;
let modoFoco = true;
let audioContext = null;

function formatarTempo(segundos) {
	const minutos = Math.floor(segundos / 60);
	const segundosRestantes = segundos % 60;
	return `${String(minutos).padStart(2, '0')}:${String(segundosRestantes).padStart(2, '0')}`;
}

function atualizarDisplay() {
	tempoElemento.textContent = formatarTempo(tempoAtualSegundos);
	faseElemento.textContent = modoFoco ? 'Foco' : 'Pausa';
}

function executarSom() {
	if (!window.AudioContext && !window.webkitAudioContext) {
		return;
	}
	if (!audioContext) {
		audioContext = new (window.AudioContext || window.webkitAudioContext)();
	}
	const context = audioContext;
	if (context.state === 'suspended') {
		context.resume();
	}
	const oscillator = context.createOscillator();
	const ganho = context.createGain();
	oscillator.type = 'sine';
	oscillator.frequency.value = 600;
	ganho.gain.value = 0.15;
	oscillator.connect(ganho);
	ganho.connect(context.destination);
	oscillator.start();
	oscillator.stop(context.currentTime + 0.4);
}

function iniciarContagem() {
	if (emExecucao) return;
	if (!audioContext && (window.AudioContext || window.webkitAudioContext)) {
		audioContext = new (window.AudioContext || window.webkitAudioContext)();
	}
	if (audioContext && audioContext.state === 'suspended') {
		audioContext.resume();
	}
	emExecucao = true;
	intervaloId = setInterval(() => {
		if (tempoAtualSegundos <= 0) {
			clearInterval(intervaloId);
			emExecucao = false;
			executarSom();
			modoFoco = !modoFoco;
			tempoAtualSegundos = modoFoco ? tempoTrabalho : tempoDescanso;
			atualizarDisplay();
			return;
		}
		tempoAtualSegundos -= 1;
		atualizarDisplay();
	}, 1000);
}

function pausarContagem() {
	if (!emExecucao) return;
	clearInterval(intervaloId);
	emExecucao = false;
}

function resetarContagem() {
	clearInterval(intervaloId);
	emExecucao = false;
	modoFoco = true;
	tempoAtualSegundos = tempoTrabalho;
	atualizarDisplay();
}

function alternarConfiguracoes() {
	configuracoes.style.display = configuracoes.style.display === 'grid' ? 'none' : 'grid';
}

function salvarConfiguracoes() {
	const trabalhoMin = Number(tempoTrabalhoInput.value) || 25;
	const descansoMin = Number(tempoDescansoInput.value) || 5;
	tempoTrabalho = trabalhoMin * 60;
	tempoDescanso = descansoMin * 60;
	if (modoFoco) {
		tempoAtualSegundos = tempoTrabalho;
	} else {
		tempoAtualSegundos = tempoDescanso;
	}
	atualizarDisplay();
	alternarConfiguracoes();
}

function alternarTema() {
	document.body.classList.toggle('dark');
	toggleTemaBotao.textContent = document.body.classList.contains('dark') ? 'Modo Claro' : 'Modo Noturno';
    // atualizar vídeo de fundo para corresponder ao tema
    atualizarVideoFundo();
}

// Troca o vídeo de fundo quando o tema é alternado
function atualizarVideoFundo() {
	if (!bgVideo) return;
	const source = bgVideo.querySelector('source');
	if (!source) return;
	if (document.body.classList.contains('dark')) {
		source.src = nightVideo;
	} else {
		source.src = dayVideo;
	}
	bgVideo.loop = true;
	bgVideo.load();
	// tentar reproduzir; ignora erro se autoplay for bloqueado
	bgVideo.play().catch(() => {});
}

// garantir que o vídeo inicial esteja em looping e corresponda ao tema atual
if (bgVideo) {
	bgVideo.loop = true;
}
// (a troca de vídeo agora é chamada dentro de alternarTema)

iniciarBotao.addEventListener('click', iniciarContagem);
pausarBotao.addEventListener('click', pausarContagem);
resetarBotao.addEventListener('click', resetarContagem);
configurarBotao.addEventListener('click', alternarConfiguracoes);
salvarConfigBotao.addEventListener('click', salvarConfiguracoes);
	toggleTemaBotao.addEventListener('click', alternarTema);

atualizarDisplay();