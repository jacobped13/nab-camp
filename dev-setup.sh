#!/bin/bash

set -e  # Exit on error
set -o pipefail

echo "🚀 Starting development setup..."

# --- SHARED INFRASTRUCTURE ---
echo "🔧 Starting shared Docker infrastructure..."
cd ./shared/infrastructure
docker compose up -d
cd ../../

# --- BACKEND SETUP ---
echo "📦 Installing backend dependencies..."
cd ./backend
npm install

echo "🔧 Running Prisma commands..."
npm run prisma:generate
npx prisma migrate deploy
npm run seed

echo "🔧 Starting Stripe webhooks..."
stripe listen --forward-to localhost:8080/billing/provider/stripe/webhook &
STRIPE_PID=$!

echo "🚀 Starting backend dev server..."
npm run dev &
BACKEND_PID=$!
cd ..

# --- FRONTEND SETUP ---
echo "📦 Installing frontend dependencies..."
cd ./frontend
npm install

echo "🚀 Starting frontend dev server..."
npm run dev &
FRONTEND_DEV_PID=$!

echo "⚡ Starting Firebase emulators..."
npm run firebase &
FIREBASE_PID=$!

# --- CLEANUP FUNCTION ---
cleanup() {
    echo "🛑 Stopping all services..."
    kill $BACKEND_PID $STRIPE_PID $FRONTEND_DEV_PID $FIREBASE_PID 2>/dev/null || true
    echo "✅ All services stopped."
    exit 0
}

# Trap Ctrl+C and call cleanup
trap cleanup SIGINT SIGTERM

# --- WAITING ON SERVERS ---
echo "✅ All services starting..."
echo "   - Backend PID: $BACKEND_PID"
echo "   - Stripe PID: $STRIPE_PID" 
echo "   - Frontend PID: $FRONTEND_DEV_PID"
echo "   - Firebase PID: $FIREBASE_PID"
echo ""
echo "Press [Ctrl+C] to stop everything."

# Wait for background jobs to keep the script alive
wait $BACKEND_PID $STRIPE_PID $FRONTEND_DEV_PID $FIREBASE_PID