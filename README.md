# Price Monitor API

API que acompanha o preço de produtos em lojas online. O usuário cadastra o link de um produto, a API faz o scraping da página e, a cada 4 horas, um agendador verifica de novo o preço e manda um e-mail quando ele cai.

## Tecnologias

- Node.js, Express 5 e TypeScript
- PostgreSQL com Knex (migrations)
- Playwright para o scraping
- node-cron para o agendamento
- Nodemailer para os e-mails
- Zod para validação
- JWT e bcrypt para autenticação

## Rotas

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/users` | Cria um usuário |
| GET | `/users/me` | Dados do usuário logado |
| POST | `/auth/sessions` | Login, retorna o token JWT |
| POST | `/products` | Cadastra um produto pelo link |
| GET | `/products` | Lista os produtos do usuário |

As rotas de produto e `/users/me` exigem o header `Authorization: Bearer <token>`.

## Estrutura

```
src/
  controllers/   recebem a requisição e devolvem a resposta
  services/      regras de negócio, scraping e envio de e-mail
  validators/    schemas do Zod
  middlewares/   autenticação e validação
  database/      conexão e migrations
  scheduler.ts   rotina que verifica os preços a cada 4 horas
```

## Como rodar

1. Copie o `.env.example` para `.env` e preencha os dados do banco, o segredo do JWT e o SMTP (dá pra usar o Mailtrap pra testar).
2. Instale as dependências e o navegador do Playwright:

```bash
npm install
npx playwright install chromium
```

3. Rode as migrations e suba a API:

```bash
npx knex migrate:latest
npm run dev
```
