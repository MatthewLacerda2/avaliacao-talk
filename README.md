# avaliacao-talk

## How to run

Up the db, install the backend packages to generate the initial migration and then start the backend:
```
docker-compose up -d
cd backend
npm install
npm run migration:generate -- src/migrations/InitialMigration
npm start
```

On another terminal, install the frontend packages and then run it:
```
cd frontend && npm install && npm run
```

Now you can go to localhost:3001, register and login and chat with whoever else is online on your local network

## UX

- Users can register with username, email and password
- Users can login with username or email, and password
- Logging in show yous the only, public chatroom where you can read and post messages

- The chatroom is realtime, using websockets

## Tech Stack

- Backend: NestJS
- Frontend: React
- Database: Postgre

Live chatroom with websockets
Authentication with JWT