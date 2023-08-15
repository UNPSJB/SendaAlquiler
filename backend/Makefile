build:
    docker-compose build

up:
    docker-compose up

migrations:
    docker-compose run web python manage.py makemigrations

migrate:
    docker-compose run web python manage.py migrate

shell:
    docker-compose run web python manage.py shell

stop:
    docker-compose down

.PHONY: build up migrations migrate shell stop
