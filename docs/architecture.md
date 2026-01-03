## General

Frontend: Vue

Backend: Fastify

Architecture: MPA (Multiple-Page Application)

API Style: REST

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

### Auth
| Method | Path                 | Description |
| ------ | -------------------- | ----------- |
| POST   | `/api/auth/login`    | Sign in     | DONE
| POST   | `/api/auth/register` | Register    | DONE
| POST   | `/api/auth/logout`   | Log out     | not yet

***Igual habria que hacer una tabla nueva para los usuarios en line o crear una variable global en el back, con un vector y el ID de usuario

### Profile changes
| Method            | Path      | Description                                 |
| -----------       | --------- | ---------------------------------------     |
| GET               | `/api/me` | Get own profile: avatar, nickname, email    |
| PATCH/PUT         | `/api/me` | Update profile, from any field to all       |

> Major: A public API to interact with the database with a secured API key, rate
limiting, documentation, and at least 5 endpoints:
◦ GET /api/{something}
◦ POST /api/{something}
◦ PUT /api/{something}
◦ DELETE /api/{something}

***La APIKEY ya funciona, solo que todas las rutas que vienen de nuestro backend entran, si quereis conectar a la db directamente, no deja (ver el Hook, se puede cambiar la logica)

Subject module specifies PUT but it makes more sense to use PATCH in this case. Consult with team. Look up PUT with partial update.

### Users
| Method | Path         | Description   |
| ------ | ------------ | -----------   |
| GET    | `/api/users` | List of users |

Response fields:
- avatar
- nickname
- username
- online status

Use queries for:
- Listing only friends
- Backend pagination

We considered both frontend limiting and backend pagination but in the end we chose pagination as it seems more scalable and a better practice.

| Method | Path             | Description           |
| ------ | ---------------- | ----------------      |
| GET    | `/api/users/:id` | Single user profile   |

Response fields:
- avatar
- nickname
- username
- achievements
- games
- isFriend
- isSelf

### Friends
| Method | Description     |
| ------ | --------------- |
| POST   | Add a friend    |
| DELETE | Remove a friend |

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
