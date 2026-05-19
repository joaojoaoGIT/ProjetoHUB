/* Estilos gerais */
* {
	box-sizing: border-box;
}

body {
	margin: 0;
	min-height: 100vh;
	font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
	background: #f4f5fb;
	color: #1f2937;
	display: grid;
	place-items: center;
	padding: 1.5rem;
}

body.dark {
	background: #111827;
	color: #e5e7eb;
}

.cronometro {
	width: min(520px, 100%);
}

header {
	text-align: center;
	margin-bottom: 1.5rem;
}

header h1 {
	margin: 0;
	font-size: clamp(2rem, 4vw, 2.8rem);
}

header h2 {
	margin: 0.5rem 0 0;
	font-weight: 400;
	color: inherit;
}

.painel {
	background: #ffffff;
	border-radius: 1.5rem;
	box-shadow: 0 24px 60px rgba(15, 23, 42, 0.12);
	padding: 2rem;
	display: grid;
	gap: 1.5rem;
}

body.dark .painel {
	background: #1f2937;
	box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
}

.status {
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 1rem;
}

#fase {
	font-size: 1rem;
	font-weight: 700;
	text-transform: uppercase;
	letter-spacing: 0.12em;
}

 .tema,
button,
input[type="number"] {
	border: none;
	border-radius: 999px;
	font: inherit;
}

.tema,
button {
	cursor: pointer;
}

.tema {
	padding: 0.75rem 1rem;
	background: #e5e7eb;
	color: #111827;
	transition: background 0.2s ease, color 0.2s ease;
}

body.dark .tema {
	background: #374151;
	color: #f9fafb;
}

#tempo {
	margin: 0;
	font-size: clamp(4rem, 8vw, 6rem);
	letter-spacing: 0.05em;
	text-align: center;
}

.botoes {
	display: flex;
	flex-wrap: wrap;
	gap: 0.75rem;
	justify-content: center;
}

button {
	padding: 0.95rem 1.3rem;
	background: #3b82f6;
	color: white;
	font-weight: 700;
	transition: transform 0.2s ease, background 0.2s ease;
}

button:hover {
	transform: translateY(-1px);
}

button:active {
	transform: translateY(0);
}

button#pausar {
	background: #f97316;
}

button#resetar {
	background: #ef4444;
}

button#configurar,
button#salvarConfig {
	background: #6d28d9;
	width: 100%;
}

body.dark button {
	box-shadow: none;
}

.configuracoes {
	display: none;
	gap: 1rem;
	background: rgba(59, 130, 246, 0.08);
	padding: 1rem;
	border-radius: 1rem;
}

body.dark .configuracoes {
	background: rgba(148, 163, 184, 0.18);
}

.configuracoes label {
	display: block;
	margin-bottom: 0.35rem;
	font-weight: 600;
}

.configuracoes input {
	width: 100%;
	padding: 0.85rem 1rem;
	background: #f3f4f6;
	color: #111827;
	border: 1px solid #d1d5db;
	margin-bottom: 1rem;
}

body.dark .configuracoes input {
	background: #111827;
	color: #e5e7eb;
	border-color: #374151;
}

@media (max-width: 420px) {
	.painel {
		padding: 1.5rem;
	}
	.botoes {
		flex-direction: column;
	}
	.tema {
		width: 100%;
	}
}
