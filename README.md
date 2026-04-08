# PawRescue NoSQL

PawRescue is a full-stack, NoSQL CRUD application designed to redirect surplus food from providers (like restaurants or grocery stores) to animal shelters in need. It features a fully custom, mobile-first prototype interface built without frameworks.

## Tech Stack
- **Database**: MongoDB (Local NoSQL) & Mongoose Schema Maps
- **Backend**: Node.js & Express.js (REST API, running on port 5001)
- **Frontend**: Vanilla HTML, CSS, and JS (Framework-free, dynamic DOM rendering via the Fetch API)

## Prerequisites
Before running this project, your computer must have the following running:
1. **[Node.js](https://nodejs.org/en/)** installed.
2. **[MongoDB Community Edition](https://www.mongodb.com/try/download/community)** installed and its background daemon (`mongod`) actively running locally on port `27017`.

---

## Installation & Setup

### 1. Start the Backend API
The backend controls the database and routing.

1. Open your terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install the required Node dependencies:
   ```bash
   npm install
   ```
3. Start the node express server:
   ```bash
   npm run dev
   ```
*If everything works, you should see a message in the terminal stating: `PawRescue API is running on port 5001` and `MongoDB connected successfully...`.*

### 2. Launch the Frontend
Because the frontend is built natively without Node frameworks like React, there is zero compilation or server setup required.

1. Simply navigate into the `frontend/` folder in your computer's file explorer.
2. Double click on **`index.html`** line to open it locally right inside your web browser (Chrome, Firefox, Safari, etc.).

---

## How to Test the Project Workflows
The project separates user experiences based on dual roles. The underlying database queries are 100% real NoSQL requests, but standard user authentication is mocked (using standard HTML LocalStorage) for grading simplicity.

### Path 1: The Food Provider
1. At the `login.html` screen, choose **Login as Food Provider**.
2. Click **Create** on the bottom navigation bar to list a surplus food item (Create).
3. Check your **History** to Update/Edit or Delete your active database listing. 

### Path 2: The Animal Shelter
1. Head to your **Profile** to log out, and log back in as an **Animal Shelter**.
2. Tap **Search** on the bottom navigation bar to load live community postings (Read/Search).
3. Find the donation you just created and click **Reserve This Food**. This will update the original Document status while simultaneously generating a cross-referenced Reservation document.

### Path 3: System Administrator
1. On the `login.html` screen, click **View Database Reports**.
2. This dashboard utilizes live MongoDB Aggregation pipelines (`$sum`, `$group`) to calculate and group live system-wide statistics.
