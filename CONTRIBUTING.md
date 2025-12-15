## SET UP
The final project is meant to be run inside Docker containers, so there's a development setup with Docker too.

Prerequisites:
- Docker installed in your PC
- .env files where there are env.example files

### Outside Docker
To run this project outside a docker network you will need to run `npm install` inside each service's directory first then run each service.

## HOW TO RUN IN DEVELOPMENT
You only need to know two commands to run this project in development.

To get it up and running:

`docker compose watch`

To stop it if there's a need to:

`docker compose down`

**In general, you shouldn't need to run this during normal development.**

Use it only if you:

- Want to stop everything completely

- Want to clean up networks/containers

- Are troubleshooting Docker itself