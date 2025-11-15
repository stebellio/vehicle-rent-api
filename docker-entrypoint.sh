#!/bin/sh
set -e

echo "Running database migrations..."
npx prisma migrate deploy

if [ ! -f "/prisma/.seeded" ]; then
  echo "Seeding database from demo.sql..."
  sqlite3 prisma/dev.db < prisma/demo.sql
  touch /prisma/.seeded
  echo "Seed completed!"
else
  echo "Seed already applied, skipping demo.sql."
fi

echo "Starting application..."
exec "$@"
