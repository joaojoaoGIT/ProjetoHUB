[README.md](https://github.com/user-attachments/files/28277660/README.md)
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
