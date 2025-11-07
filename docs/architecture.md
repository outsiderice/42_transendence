## Estrucutra de carpetas

Estructure inicial de archivos, para que todo el mundo sepa donde poner las cosas.

```
└── 42_transendence
    ├── backend
    │   ├── Dockerfile
    │   ├── package.json
    │   ├── package-lock.json
    │   ├── src
    │   │   ├── config
    │   │   │   ├── db.ts
    │   │   │   ├── fastify-swagger.d.ts
    │   │   │   └── websocket.ts
    │   │   ├── modules
    │   │   │   ├── auth
    │   │   │   │   ├── auth.controller.ts
    │   │   │   │   ├── auth.routes.ts
    │   │   │   │   └── auth.service.ts
    │   │   │   ├── chat
    │   │   │   │   ├── chat.gateway.ts
    │   │   │   │   └── chat.routes.ts
    │   │   │   ├── game
    │   │   │   │   ├── ai
    │   │   │   │   │   └── ai.bot.ts
    │   │   │   │   ├── game.logic.ts
    │   │   │   │   └── game.routes.ts
    │   │   │   └── users
    │   │   │       ├── usersControllers.ts
    │   │   │       └── usersRoutes.ts
    │   │   └── server.ts
    │   └── tsconfig.json
    ├── db
    │   └── data.db
    ├── docker-compose.yml
    ├── docs
    │   ├── api-contracts.md
    │   └── architecture.md
    └── frontend
        ├── Dockerfile
        ├── index.html
        ├── package.json
        ├── package-lock.json
        ├── public
        │   └── vite.svg
        ├── src
        │   ├── counter.ts
        │   ├── main.ts
        │   ├── style.css
        │   └── typescript.svg
        ├── tsconfig.json
        └── vite.config.ts

```
