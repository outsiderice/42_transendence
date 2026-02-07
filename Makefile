

.PHONY:	watch down re

watch:
	cp .env.example .env
	cp frontend/.env.example frontend/.env
	cp backend/.env.example backend/.env
	cp db/.env.example db/.env
	docker compose watch

down:
	docker compose down

re: down watch
	
