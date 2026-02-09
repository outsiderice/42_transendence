

.PHONY:	watch down up re

watch:
	cp .env.example .env
	cp frontend/.env.example frontend/.env
	cp backend/.env.example backend/.env
	cp db/.env.example db/.env
	docker compose watch

up:
	cp .env.example .env
	cp frontend/.env.example frontend/.env
	cp backend/.env.example backend/.env
	cp db/.env.example db/.env
	docker compose up

down:
	docker compose down

re: down watch
	
