# E-Kar Nepal - Local Setup Guide

Welcome to the E-Kar Nepal project! This guide will walk you through the exact steps to get the application running on your PC for the first time.

The project is split into two main parts:
1. **Backend**: A Node.js server that connects to a MySQL database.
2. **Frontend**: A React (Vite) web application.




https://github.com/user-attachments/assets/7ab583b0-ada8-4266-b3af-c0c76056b8ee


---

## 🛠️ Prerequisites

Before you start, make sure you have the following installed on your PC:
1. **Node.js**: (Download from [nodejs.org](https://nodejs.org/)) - Needed to run both the frontend and backend.
2. **XAMPP / MySQL**: (Download from [apachefriends.org](https://www.apachefriends.org/)) - Needed to run the local database.

---

## 🚀 Step-by-Step Setup

### 1. Start the Database (MySQL)
The backend expects a MySQL database running on your local machine with no password.
1. Open the **XAMPP Control Panel**.
2. Click **Start** next to **MySQL** (and **Apache** if you want to use phpMyAdmin to view the tables).
3. Ensure you have a database created named `records_government`. *(If you haven't created it yet, go to `http://localhost/phpmyadmin`, click "New", and create a database named `records_government`)*.

### 2. Start the Backend Server
The backend handles API requests, database queries, and tax calculations.
1. Open a terminal (Command Prompt, PowerShell, or VS Code Terminal).
2. Navigate to the backend folder:
   ```bash
   cd backend
   ```
3. Install the required Node dependencies (you only need to do this the very first time):
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   node server.js
   ```
   *You should see a message saying: `Server running on port 5000` and `Connected to MySQL database`.*

### 3. Start the Frontend Application
The frontend is the visual user interface built with React.
1. Open a **new, separate terminal window** (keep the backend terminal running!).
2. Navigate to the frontend folder:
   ```bash
   cd frontend
   ```
3. Install the required dependencies (you only need to do this the very first time):
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *To access it on your mobile phone on the same WiFi network, run `npm run dev -- --host` instead.*

---

## 🎉 Accessing the App

Once both the backend and frontend are running:
- **On your PC**: Open your web browser and go to `http://localhost:5173`
- **On your Phone**: Look at the terminal output for the frontend. It will show a "Network" IP address (e.g., `http://192.168.x.x:5173`). Type that exact URL into your phone's browser.

*(Note: The backend must remain open and running in the terminal while you use the app!)*
