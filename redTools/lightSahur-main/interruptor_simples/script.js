const interruptores = document.querySelectorAll('.interruptor');
const body = document.body;
let ligada = false;

interruptores.forEach((interruptor) => {
  interruptor.addEventListener('click', () => {
    ligada = !ligada;
    interruptores.forEach((item) => item.classList.toggle('ligado', ligada));
    body.classList.toggle('claro', ligada);
  });
});
