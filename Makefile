

.PHONY:	watch down clean up re fre 

watch:
	touch db/data/app.db
	cp .env.example .env
	cp frontend/.env.example frontend/.env
	cp backend/.env.example backend/.env
	cp db/.env.example db/.env
	docker compose watch

up:
	mkdir db/data
	touch db/data/app.db
	cp .env.example .env
	cp frontend/.env.example frontend/.env
	cp backend/.env.example backend/.env
	cp db/.env.example db/.env
	docker compose up

down:
	docker compose down

clean:
	rm db/data/app.db

re: down watch

fre: down clean watch

