#!/bin/sh

# Wait for the DB to be ready
# You can include something like wait-for-it.sh script if using Postgres to ensure the database is ready before Django starts.

python manage.py migrate
python manage.py collectstatic --noinput

exec "$@"
