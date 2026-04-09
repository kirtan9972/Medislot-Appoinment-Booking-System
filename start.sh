#!/bin/bash

echo "Starting Medislot Project..."
echo "=============================="

# Start backend
echo "Starting backend server..."
cd backend
npm run dev &
BACKEND_PID=$!

# Wait backend initialization
echo "Waiting for backend to start and connect database..."
for i in {1..20}; do
  if curl -s http://localhost:5001/api/doctors --fail -o /dev/null; then
    echo "Backend is up (doctors endpoint reachable)."
    break
  fi
  sleep 1
  echo -n "."
  if [ $i -eq 20 ]; then
    echo "\nWarning: backend did not become reachable in 20 seconds. Please check DB connection and server logs."
  fi
done

# Start frontend
echo "Starting frontend server..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo "=============================="
echo "Both servers are starting..."
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo "=============================="
echo "Press Ctrl+C to stop both servers"

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID