.ONESHELL:

.PHONY: help
help: ## Show this help
	@egrep -h '\s##\s' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: install
install: ## Install requirements
	pip install -r requirements.txt

freeze: ## Pin current dependencies
	pip freeze > requirements.txt

migrate: ## Make and run migrations
	python manage.py makemigrations && \
	python manage.py migrate

dump: ## Dump database to a json file:
	python manage.py dumpdata --natural-foreign --natural-primary --exclude=contenttypes --exclude=auth.Permission --exclude=admin.logentry --exclude=sessions.session --indent 4 > fixtures/bd.json

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

.PHONY: csu
csu: ## Run createsuperuser
	python manage.py createsuperuser
