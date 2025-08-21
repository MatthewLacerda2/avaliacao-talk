# avaliacao-talk

# How to run

docker run -d --name postgres-avaliacao -e POSTGRES_USER=candidato -e POSTGRES_PASSWORD=av4li4cao -e POSTGRES_DB=avaliacao -p 5432:5432 postgres:latest

Run these commands from two separate terminals:
```
cd backend && npm start
cd frontend && npm run
```
Now you can go to localhost:3000, register and login and chat with whoever else is online on your local network

# UX

- Users can register with username, email and password
- Users can login with username or email, and password
- Logging in show yous the only, public chatroom where you can read and post messages

- The chatroom is realtime, using websockets

# Tech Stack

- Backend: NestJS
- Frontend: React
- Database: Postgre

Live chatroom with websockets
Authentication with JWT