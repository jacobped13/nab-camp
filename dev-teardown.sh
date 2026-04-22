#!/bin/bash

echo "🛑 Starting development teardown..."

echo "⚡ Killing backend server..."
pkill -f "tsx watch ./src/server.ts" || true

echo "⚡ Killing frontend server..."
pkill -f "vite" || true

echo "⚡ Killing Stripe webhooks..."
pkill -f "stripe listen" || true

echo "⚡ Killing Firebase emulators..."
pkill -f "firebase emulators:start" || true
# Fallback to kill the java processes spawned by firebase just in case
pkill -f "firebase-emulator" || true

echo "🧹 Resetting Prisma Database..."
cd ./backend
npx prisma migrate reset --force || true
cd ..

echo "🛑 Stopping shared Docker infrastructure and wiping database volumes..."
cd ./shared/infrastructure
docker compose down -v
cd ../../

echo "✅ Teardown complete. All services stopped and database volumes reset."
echo "You can now run ./dev-setup.sh for a completely fresh start."
