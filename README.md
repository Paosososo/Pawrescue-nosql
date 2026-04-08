# PawRescue NoSQL

PawRescue is a web-based NoSQL CRUD application connecting food providers with animal shelters.

## Features
- Complete RESTful API for Providers, Shelters, Donations, and Reservations.
- Advanced MongoDB Aggregation Pipelines for generating reports.
- Modern, clean frontend built with HTML, Tailwind CSS, and Vanilla JavaScript.

## Setup Instructions

1. Inside `backend`, run `npm install` to install dependencies.
2. Start your local MongoDB server (`mongod`), ensuring it runs on port `27017` or update `MONGO_URI` in `backend/.env`.
3. Run `npm start` or `npm run dev` inside the `backend` folder to start the Express server on port 5000.
4. In your browser or using a live server, open `frontend/index.html` to access the application.

## API Endpoints
- `/api/providers` (GET, POST, PUT, DELETE)
- `/api/shelters` (GET, POST, PUT, DELETE)
- `/api/donations` (GET, POST, PUT, DELETE)
- `/api/reservations` (GET, POST, PUT, DELETE)
- `/api/reports/summary` (GET) - Returns aggregation summaries.
