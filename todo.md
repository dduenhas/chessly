# Chessly - Aprenda Xadrez ♞

Aplicação interativa para ensino de xadrez para iniciantes, 100% em português brasileiro.

## Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Tabuleiro**: chessground (mesma lib do lichess.org)
- **Lógica**: chess.js
- **Estilo**: Tailwind CSS
- **Deploy**: Vercel (free tier)

## Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| 📖 **Aprender** | 5 lições interativas: peças, movimentos, capturas, xeque, xeque-mate |
| 🎮 **Jogar** | Jogo contra o computador em 3 níveis de dificuldade (usa chess.js offline) |
| 🎯 **Exercícios** | 22 exercícios progressivos com feedback imediato em 5 categorias |
| 📊 **Progresso** | Sistema de progresso salvo em localStorage |

## Rodar localmente

```bash
npm install
npm run dev
```

Acesse http://localhost:3000

## Build de produção

```bash
npm run build
npm run preview
```

## Deploy na Vercel

1. Conecte o repositório na Vercel
2. Framework: Vite
3. Build command: `npm run build`
4. Output directory: `dist`
