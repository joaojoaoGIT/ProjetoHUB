# 🍅 Pomodoro Timer

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
