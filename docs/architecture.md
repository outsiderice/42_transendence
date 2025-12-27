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
| POST   | `/api/auth/login`    | Sign in     |
| POST   | `/api/auth/register` | Register    |
| POST   | `/api/auth/logout`   | Log out     |

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
ft_transcendence
├── ANÁLISIS_START_SERVICES.txt         //añadir ciertas cosas a troubleshooting en contributin.md o algo y eliminar?
├── CAMBIOS_REALIZADOS.txt              //mirar formato de api contracts y ver si utilizarlo en api-contracts.md o architecure.md 
├── CONTRIBUTING.md                 
├── README.md
├── backend
│   ├── Dockerfile
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── config
│   │   │   ├── db.ts
│   │   │   ├── fastify-swagger.d.ts
│   │   │   └── websocket.ts
│   │   ├── modules
│   │   │   ├── auth
│   │   │   │   ├── auth.controller.ts
│   │   │   │   ├── auth.routes.ts
│   │   │   │   └── auth.service.ts
│   │   │   ├── game                //probably won't be here. Ask Kate
│   │   │   │   ├── game.logic.ts
│   │   │   │   └── game.routes.ts
│   │   │   └── users
│   │   │       ├── Controllers
│   │   │       │   └── userControllers.ts
│   │   │       ├── userSchemas.ts
│   │   │       └── usersRoutes.ts
│   │   ├── server.ts
│   │   └── services
│   │       └── dbClient.ts
│   └── tsconfig.json
├── db
│   ├── Dockerfile
│   ├── README.md
│   ├── data
│   │   └── app.db
│   ├── data.db
│   ├── package-lock.json
│   ├── package.json
│   ├── src
│   │   ├── config
│   │   │   ├── fastify-swagger.d.ts  //will be deleted
│   │   │   └── sqlite.ts             //will probably change
│   │   ├── modules
│   │   │   └── users
│   │   │       ├── users.routes.ts
│   │   │       └── users.service.ts
│   │   └── server.ts
│   └── tsconfig.json
├── docker-compose.yml
├── docs
│   ├── api-contracts.md                //eliminar? y dejarlo todo en architecture.md?
│   ├── architecture.md
│   └── db_schema.png                   //imagen de esquema base de datos
├── frontend
│   ├── Dockerfile
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── public
│   │   └── vite.svg
│   ├── src
│   │   ├── prueba.ts
│   │   ├── style.css
│   │   └── typescript.svg
│   ├── tsconfig.json
│   └── vite.config.ts
├── start-backend.sh            //scripts 
├── start-db.sh
└── start-services.sh

```
