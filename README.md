# avaliacao-talk

# How to run

<insert command to create a dockercontainer that means the backend's .env>

Run these commands from two separate terminals:

cd backend && npm start
cd frontend && npm run

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