# 🏪 Store Rating Platform - FullStack Intern Coding Challenge

A complete full-stack web application that allows users to submit ratings for registered stores. Built with **Express.js**, **MySQL**, **Sequelize**, and **React.js** with **Material-UI**.

## 📋 Table of Contents

- [Tech Stack](#tech-stack)
- [Features](#features)
- [Project Structure](#project-structure)
- [Installation Guide](#installation-guide)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Test Credentials](#test-credentials)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Time Spent](#time-spent)
- [Future Improvements](#future-improvements)

## 🛠 Tech Stack

### Backend
- **Framework**: Express.js
- **Database**: MySQL
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens)
- **Password Encryption**: bcrypt
- **Validation**: Validator.js

### Frontend
- **Framework**: React.js 18
- **UI Library**: Material-UI (MUI)
- **HTTP Client**: Axios
- **Routing**: React Router DOM v6
- **State Management**: React Context API

## ✨ Features

### System Administrator
- ✅ Add new stores, normal users, and admin users
- ✅ Dashboard with total users, stores, and ratings
- ✅ View and manage all users (Name, Email, Address, Role)
- ✅ View all stores (Name, Email, Address, Rating)
- ✅ Filter listings by Name, Email, Address, and Role
- ✅ Sort tables by any column (ascending/descending)
- ✅ View detailed user information
- ✅ Export data to CSV
- ✅ Change password

### Normal User
- ✅ Register and login to the platform
- ✅ Update password after logging in
- ✅ View all registered stores
- ✅ Search stores by Name and Address
- ✅ View store details: Name, Address, Overall Rating, My Rating
- ✅ Submit ratings (1-5 stars) for stores
- ✅ Update existing ratings
- ✅ Logout

### Store Owner
- ✅ Login to the platform
- ✅ Update password
- ✅ Dashboard showing all owned stores
- ✅ View average rating for each store
- ✅ View list of users who rated their stores
- ✅ See individual ratings from users
- ✅ Logout

### Form Validations
- ✅ Name: 20-60 characters
- ✅ Address: Maximum 400 characters
- ✅ Password: 8-16 characters, 1 uppercase, 1 special character
- ✅ Email: Standard email validation

## 📁 Project Structure

internship-project/
│
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── storeController.js
│   │   ├── ratingController.js
│   │   └── ownerController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── validationMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Store.js
│   │   └── Rating.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── storeRoutes.js
│   │   ├── ratingRoutes.js
│   │   └── ownerRoutes.js
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   ├── Admin/
│   │   │   ├── User/
│   │   │   └── Owner/
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── UserDashboard.js
│   │   │   └── OwnerDashboard.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── README.md
│
├── database.sql
└── README.md


## 🚀 Installation Guide

### Prerequisites
- Node.js (v14 or higher)
- MySQL (v5.7 or higher)
- npm or yarn package manager

### Step 1: Clone the Repository

```bash
git clone <your-repo-url>
cd internship-project
```

### Step 2: Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Run the database schema
source database.sql

# Or copy and paste the SQL commands from database.sql
```

### Step 3: Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your database credentials
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=yourpassword
# DB_NAME=internship_db
# JWT_SECRET=your_super_secret_key
# PORT=5000
```

### Step 4: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# The frontend will run on http://localhost:3000
```

## 🏃 Running the Application

### Start Backend Server

```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### Start Frontend Application

```bash
cd frontend
npm start
# Application opens at http://localhost:3000
```

## 🔐 Test Credentials

### Admin User

```
Email: admin@example.com
Password: Password@123
Role: System Administrator
```

### Store Owner

```
Email: owner@example.com
Password: Password@123
Role: Store Owner
```

### Regular User

```
Email: user@example.com
Password: Password@123
Role: Normal User
```

> **Note:** First, register these users through the application or create them using the registration form, then update their roles in the database.

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| PUT | `/api/auth/change-password` | Update password |

### Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| POST | `/api/users` | Create new user |
| GET | `/api/stores` | Get all stores |
| POST | `/api/stores` | Create new store |
| GET | `/api/auth/users/:id` | Get user details |

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ratings` | Submit rating |
| PUT | `/api/ratings/:id` | Update rating |

### Owner Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/owner/dashboard` | Get owner dashboard data |

## 📸 Screenshots

### Login Page
![Login Page](https://screenshots/login.png)

### Admin Dashboard
![Admin Dashboard](https://screenshots/admin-dashboard.png)

### User Store Listing
![User Store Listing](https://screenshots/user-stores.png)

### Owner Dashboard
![Owner Dashboard](https://screenshots/owner-dashboard.png)

### Rating Modal
![Rating Modal](https://screenshots/rating-modal.png)

## ⏱ Time Spent

| Component | Time Spent |
|-----------|------------|
| Database Design & Setup | 1 hour |
| Backend API Development | 4 hours |
| Authentication & Middleware | 2 hours |
| Admin Features | 2 hours |
| User Features | 2 hours |
| Owner Features | 1.5 hours |
| Frontend UI Development | 5 hours |
| Integration & Testing | 2 hours |
| Documentation | 1 hour |
| **Total** | **20.5 hours** |

## 🔮 Future Improvements

### Short-term Improvements
- [ ] Add pagination for large data sets
- [ ] Implement real-time notifications for new ratings
- [ ] Add profile picture upload functionality
- [ ] Implement password reset via email
- [ ] Add dark mode toggle

### Long-term Improvements
- [ ] Mobile application using React Native
- [ ] Store analytics dashboard with charts
- [ ] Implement review comments along with ratings
- [ ] Add store categories and filtering
- [ ] Implement rating history timeline
- [ ] Add export functionality for owners (PDF/Excel)
- [ ] Implement role-based permissions system
- [ ] Add two-factor authentication
- [ ] Implement API rate limiting
- [ ] Add unit tests and integration tests

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is for internship assessment purposes only.

## 📧 Contact

Your Name - [your.email@example.com](mailto:your.email@example.com)

Project Link: [https://github.com/yourusername/internship-project](https://github.com/yourusername/internship-project)
```

This README is now properly formatted with:
- All headings using `#` symbols correctly
- Proper table formatting
- Code blocks with language specifications
- Bullet points and checklists
- Blockquotes for important notes
- Proper escaping of special characters
- Consistent spacing and structure

You can copy this entire content and paste it directly into your README.md file.
