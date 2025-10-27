## Estrucutra de carpetas

Estructure inicial de archivos, para que todo el mundo sepa donde poner las cosas.

```
ft_transcendence/
│
├── docker-compose.yml
├── .env
├── README.md
│
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/
│   │   │   │   ├── auth.routes.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── auth.controller.ts
│   │   │   ├── game/
│   │   │   │   ├── game.routes.ts
│   │   │   │   ├── game.logic.ts
│   │   │   │   └── ai/
│   │   │   │       └── ai.bot.ts
│   │   │   ├── chat/
│   │   │   │   ├── chat.routes.ts
│   │   │   │   └── chat.gateway.ts
│   │   │   └── users/
│   │   │       ├── users.routes.ts
│   │   │       └── users.service.ts
│   │   ├── server.ts
│   │   └── config/
│   │       ├── db.ts
│   │       └── websocket.ts
│   ├── package.json
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── services/      # API wrappers (Axios/fetch)
│   │   └── styles/
│   ├── package.json
│   └── Dockerfile
│
├── db/
│   └── data.db            # SQLite file (volume-mounted)
│
└── docs/
    ├── architecture.md
    ├── api-contracts.md
    └── team-plan.md
```
