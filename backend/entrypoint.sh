#!/bin/sh

# Wait for the database to be ready
# In a real-world scenario, you might add a loop here to wait for the DB to be available.

echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting application..."
# Execute the command passed to the entrypoint
exec "$@"