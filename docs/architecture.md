## General

Frontend: Vue
Backend: Fastify
Architecture: MPA (Multiple-Page Application)
API Style: 
Auth: JWT

## Page Routes (HTML)

| Screen (check figma)  | Method | Path                      | Auth     | Notes                                 |
| -----------------     | ------ | ------------------------- | -------- | --------------------------------------|
| Home                  | GET    | `/`                       | No       |                                       |
| Terms of Service      | GET    | `/terms`                  | No       |                                       |
| Privacy Policy        | GET    | `/privacy-policy`         | No       |                                       |
| Sign In               | GET    | `/sign-in`                | No       |                                       |
| Sign Up               | GET    | `/sign-up`                | No       |                                       |
| Play Local            | GET    | `/play-local`             | No       |                                       |
| Play Online           | GET    | `/play-online`            | No       |                                       |
| User home             | GET    | `/dashboard`              | Required | Redirect if unauthenticated           |
| Edit Profile          | GET    | `/settings`               | Required |                                       |
| Users                 | GET    | `/users`                  | Required | User list, can filter to just friends |
| User Profile          | GET    | `/users/:id`              | Required | Public profile                        |


## API endpoints (JSON)

POST when signing in
POST when registering
POST when logging out

PUT (or POST?) when changing things in your profile

POST when adding a friend
DELETE friendship when unfriending another user

GET list of users (paginado o no?), username and avatars, and status (tambien usar para solo lista de amigos?)

GET avatar, nickname, username, is friend?
    list of achievements ?
    list of games ?

GET avatar, nickname, email, password

## Estrucutra de carpetas

Estructura inicial de archivos, para que todo el mundo sepa donde poner las cosas.

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
