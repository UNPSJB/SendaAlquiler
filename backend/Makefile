SHELL := /bin/bash
BASE_PYTHON := ~/.pyenv/versions/3.8.6/bin/python
VENV_PATH := ~/.virtualenvs/botalks
VENV_PYTHON := ~/.virtualenvs/botalks/bin/python
.ONESHELL:

.PHONY: help
help: ## Show this help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: venv
venv: ## Install requirements
	${BASE_PYTHON} -m venv ${VENV_PATH}

.PHONY: install
install: ## Install requirements
	pip install -r requirements.txt

.PHONY: install-venv
install-venv: ## Install requirements
	${VENV_PYTHON} -m pip install -r requirements.txt

install-lbl: ## Install requirements line by line. It evits error if one dependency can't be installed
	(cat requirements.txt | xargs -n 1 pip install) || true

freeze: ## Pin current dependencies
	pip freeze > requirements.txt

makemigrations: ## plain and simple 'python manage.py makemigrations'
	python manage.py makemigrations

migrate-simple: ## plain and simple 'python manage.py migrate'
	python manage.py migrate

migrate: ## Make and run migrations
	python manage.py makemigrations && \
	python manage.py migrate

dump: ## Dump database to a json file:
	python manage.py dumpdata --indent=2 --exclude auth.permission --exclude contenttypes > fixtures/bd.json
# python manage.py dumpdata --natural-foreign --natural-primary --exclude=contenttypes --exclude=auth.Permission --exclude=admin.logentry --exclude=sessions.session --indent 4 > initial_data.json

seed: ## Load sample data into the database
	python manage.py loaddata fixtures/bd.json

collect: ## Collect Static without input
	python manage.py collectstatic --noinput

.PHONY: test
test: ## Run tests
	python manage.py test application --verbosity=0 --parallel --failfast

.PHONY: serve
serve: ## Run the Django server
	python manage.py runserver 0.0.0.0:8000

.PHONY: uwsgi
uwsgi: ## Run uwsgi
	uwsgi --ini uwsgi.ini

.PHONY: csu
csu: ## Run createsuperuser
	python manage.py createsuperuser
