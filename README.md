# GiftFlow

## Demo

📹 Check out our [demo video](demo/demo.mp4) to see GiftFlow in action!

## Setup

1. Install backend dependencies: ```cd backend && npm install```
2. Install frontend dependencies: ```cd frontend && npm install```
3. In ```backend/``` folder copy ```env-original``` file, rename it to ```.env``` and set all database variables

### Run in local environment

4. Set NODE_ENV=dev in ```.env``` file
5. Run backend: ```cd backend && npm run dev```
6. Run frontend: ```cd frontend && npm start```

### Run in development environment

4. Set NODE_ENV=production in ```.env``` file
4. Build frontend: ```cd frontend && npm run build```
5. Run backend: ```cd backend && npm start```

### Database

Create MySQL database and run ```db_structure.sql``` file to create all tables
