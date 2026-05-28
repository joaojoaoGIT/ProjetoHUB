const room = document.getElementById('room');
const counterVal = document.getElementById('counterVal');
const statusLabel = document.getElementById('statusLabel');
const switchBtn = document.getElementById('switchBtn');
const character = document.getElementById('character');
const characterImg = document.getElementById('characterImg');

let isOn = false;
let count = 0;

function setHappy() {
  characterImg.src = 'img/tungs.png';
}

function setSad() {
  characterImg.src = 'img/tung_triste.png';
}

function toggle() {
  isOn = !isOn;

  if (isOn) {
    count++;
    counterVal.textContent = count;

    room.classList.remove('dark');
    room.classList.add('light');

    statusLabel.classList.remove('status-off');
    statusLabel.classList.add('status-on');
    statusLabel.innerHTML = '<span></span>LUZ ACESA';

    characterImg.src = 'img/tungPulando.png';
    character.classList.add('jumping');

    setTimeout(() => {
      character.classList.remove('jumping');
      setHappy();
    }, 600);

  } else {
    room.classList.remove('light');
    room.classList.add('dark');

    statusLabel.classList.remove('status-on');
    statusLabel.classList.add('status-off');
    statusLabel.innerHTML = '<span></span>LUZ APAGADA';

    setSad();
  }
}

switchBtn.addEventListener('click', toggle);
