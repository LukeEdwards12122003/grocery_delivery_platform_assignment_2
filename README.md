# Grocery Delivery Platform

## Overview

The Grocery Delivery Platform is a small MERN web application developed for IFN636 Assessment 1. The application demonstrates two user roles and two connected end-to-end workflows.

Customers can register, log in, place grocery delivery orders, and view their submitted orders and current status. Store Staff can log in, view incoming customer orders, and update each order's status.

## User Roles

### Customer

- Register and log in
- Access the Customer Dashboard
- Place grocery orders
- Enter a quantity and delivery address
- View submitted orders
- View current order status

### Store Staff

- Register and log in
- Access the Store Staff Dashboard
- View incoming customer orders
- View customer details and delivery information
- Update order status

## Order Status

Orders can have one of the following statuses:

- Pending
- Preparing
- Completed

New orders are automatically created with a Pending status.

## Application Architecture

The application uses the MERN stack:

- MongoDB for persistent user and order data
- Express.js for backend API routes
- React for the frontend interface
- Node.js for the backend application

Authentication uses JSON Web Tokens (JWT). Protected backend routes use authentication middleware to identify the logged-in user and control access based on the user's role.

1. Clone the Repository
git clone https://github.com/LukeEdwards12122003/grocery_delivery_platforms.git

Move into the project folder:

cd grocery_delivery_platforms
2. Install Dependencies

Install the backend and frontend dependencies from the project root:

npm run install-all
3. Configure Environment Variables

Create a .env file inside the backend directory.

Use the following structure:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5001

Do not commit the .env file or real credentials to GitHub.

The included .env.example file can be used as a reference.

4. Start the Application

From the project root, run:

npm run dev

The frontend runs on:

http://localhost:3000

The backend runs on from mongo db

    
