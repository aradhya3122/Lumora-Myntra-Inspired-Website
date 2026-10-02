# Lumora — Modern Fashion E-Commerce Platform

Lumora is a full-stack, production-ready fashion e-commerce application designed to provide a premium online shopping experience. Inspired by leading platforms like Myntra, it features a custom brand identity, responsive design, and robust backend architecture.

## Features

- **Modern & Responsive UI**: Built with React, Tailwind CSS, and Lucide React icons for a beautiful, mobile-friendly interface.
- **Full-Stack Architecture**: React frontend communicating with an Express.js/Node.js backend.
- **Robust State Management**: Redux Toolkit used for managing Cart, Wishlist, and Authentication state.
- **Secure Authentication**: JWT-based authentication stored in HTTP-only cookies for enhanced security against XSS attacks.
- **Comprehensive Shopping Flow**:
  - Browse products by category (Men, Women, Kids, Beauty, Accessories).
  - Detailed product views with image galleries, size/color selection, and stock status.
  - Cart and Wishlist management.
  - Multi-step checkout process (Address, Payment, Review).
- **User & Order Management**: User profiles, order history, and detailed order status tracking.
- **Admin Dashboard**: Centralized view for managing users, products, and orders, along with revenue statistics.

## Tech Stack

### Frontend (Client)
- **Framework**: React 18 (Vite)
- **Styling**: Tailwind CSS
- **State Management**: Redux Toolkit (`@reduxjs/toolkit`, `react-redux`)
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend (Server)
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs
- **Middleware**: `express-async-handler`, `cookie-parser`, `cors`

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Running locally or via MongoDB Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aradhya3122/Lumora-Myntra-Inspired-Website.git
   cd Lumora
   ```

2. **Install Server Dependencies:**
   ```bash
   cd server
   npm install
   ```

3. **Install Client Dependencies:**
   ```bash
   cd ../client
   npm install
   ```

### Configuration

Create a `.env` file in the `server` directory with the following variables:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/lumora
JWT_SECRET=your_jwt_secret_key_here
```

### Database Seeding

To populate the database with sample products and an admin user, run:
```bash
cd server
npm run data:import
```
*(To destroy all data, you can run `npm run data:destroy`)*

**Sample Admin Credentials:**
- Email: `admin@lumora.com`
- Password: `123456`

### Running the Application

1. **Start the Backend Server (from `/server`):**
   ```bash
   npm run dev
   ```

2. **Start the Frontend Client (from `/client`):**
   ```bash
   npm run dev
   ```

The application will be accessible at `http://localhost:5173/` and the API at `http://localhost:5000/`.

## Folder Structure

```
Lumora/
├── client/                 # React Frontend
│   ├── public/             # Static assets
│   └── src/                # React source code
│       ├── components/     # Reusable UI components
│       ├── pages/          # Application pages/routes
│       ├── store/          # Redux configuration & slices
│       ├── index.css       # Global styles & Tailwind directives
│       └── App.jsx         # Main application routing
└── server/                 # Express Backend
    ├── controllers/        # Route controllers/logic
    ├── middleware/         # Custom middlewares (auth, error handling)
    ├── models/             # Mongoose database schemas
    ├── routes/             # Express API routes
    ├── seed/               # Database seed scripts and sample data
    └── server.js           # Main application entry point
```

## License
This project is open-source and available under the MIT License.