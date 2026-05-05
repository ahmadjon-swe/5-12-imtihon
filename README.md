# 🚗 Auto Diler — Car Dealership Web Application

A full-stack car dealership platform where users can browse, save, and manage car listings. Built with a **Node.js/Express** REST API backend and a **React** frontend.

---

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)

---

## ✨ Features

### 👤 User
- Register, login, and logout with JWT authentication
- Email verification via OTP
- Forgot password & reset via email
- View and update profile
- Browse all cars and categories
- View car details (main, inner, and outer images)
- Save / unsave favourite cars
- Delete account

### 🛠️ Admin
- Add, edit, and delete car listings (with image uploads)
- Add, edit, and delete car categories
- Manage own listings via admin dashboard

### 🔐 Security
- JWT access & refresh token system (via HTTP-only cookies)
- Role-based authorization (user / admin / superadmin)
- Request validation with Joi
- Centralized error handling
- Winston logging (all logs, errors, exceptions, warnings)

### 📄 Documentation
- Full Swagger / OpenAPI documentation at `/api-docs`

---

## 🛠️ Tech Stack

### Backend
| Package | Purpose |
|---|---|
| Express 5 | HTTP server & routing |
| Mongoose | MongoDB ODM |
| JSON Web Token | Authentication |
| bcryptjs | Password hashing |
| Multer | Image file uploads |
| Nodemailer | Email sending (OTP, password reset) |
| Joi | Request body validation |
| Winston | Logging |
| Swagger UI Express | API documentation |
| UUID | Unique filenames for uploaded images |

### Frontend
| Package | Purpose |
|---|---|
| React 19 | UI library |
| React Router DOM 7 | Client-side routing |
| Axios | HTTP requests |
| Vite | Build tool & dev server |

---

## 📁 Project Structure

```
auto-diler/
├── backend/
│   ├── config/          # Database connection
│   ├── controller/      # Route handlers (auth, car, category, save, superadmin)
│   ├── docs/            # Swagger YAML documentation
│   ├── errors/          # Custom error classes
│   ├── middleware/       # Auth, authorization, validation, upload, error handling
│   ├── router/          # Express routers
│   ├── schema/          # Mongoose schemas (auth, car, category, save)
│   ├── uploads/         # Uploaded images (cars & categories)
│   ├── utils/           # JWT helper, logger, email sender
│   ├── validator/       # Joi validation schemas
│   └── index.js         # App entry point
│
└── client/
    └── src/
        ├── api/         # Axios instance & API call functions
        ├── components/  # Navbar, ProfileModal, ProtectedRoute
        ├── context/     # AuthContext, ToastContext
        └── pages/
            ├── admin/   # AdminDashboard, AddCar, EditCar, AddCategory, EditCategory
            ├── auth/    # Login, Register, Verify, ForgotPassword
            └── user/    # CarDetail, CategoryCars, SavedCars
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account (or local MongoDB instance)
- A Gmail account with an [App Password](https://support.google.com/accounts/answer/185833) for sending emails

### 1. Clone the repository

```bash
git clone https://github.com/your-username/auto-diler.git
cd auto-diler
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file (see [Environment Variables](#environment-variables) below), then start the server:

```bash
npm run dev
```

The API will be running at `http://localhost:4001`
Swagger docs will be available at `http://localhost:4001/api-docs`

### 3. Set up the Frontend

```bash
cd ../client
npm install
npm run dev
```

The React app will be running at `http://localhost:5173`

---

## ⚙️ Environment Variables

Create a `.env` file inside the `backend/` folder with the following variables:

```env
PORT=4001
SECRET_KEY=your_jwt_access_secret
REFRESH_SECRET_KEY=your_jwt_refresh_secret
MONGO_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/?appName=yourApp
GOOGLE_PASS=your_gmail_app_password
```

> ⚠️ **Never commit your `.env` file.** Add it to `.gitignore`.

---

## 📡 API Endpoints

### Auth (`/`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Login |
| POST | `/logout` | Private | Logout |
| POST | `/verify` | Public | Verify OTP |
| POST | `/resend_otp` | Public | Resend OTP |
| POST | `/refresh_token` | Public | Refresh JWT access token |
| PATCH | `/change_password` | Private | Change password |
| POST | `/forgot_password` | Public | Request password reset |
| POST | `/forgot_password_verify` | Public | Verify & set new password |
| GET | `/get_my_profile` | Private | Get logged-in user profile |
| DELETE | `/delete_account` | Private | Delete account |

### Cars (`/`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/get_all_cars` | Public | Get all car listings |
| GET | `/get_one_car/:id` | Public | Get a single car |
| GET | `/get_my_cars` | Private | Get cars posted by the logged-in user |
| POST | `/add_car` | Private | Add a new car listing |
| PUT | `/update_car/:id` | Private | Update a car listing |
| DELETE | `/delete_car/:id` | Private | Delete a car listing |
| POST | `/save_car/:id` | Private | Save / unsave a car |
| GET | `/get_saved_cars` | Private | Get all saved cars |
| DELETE | `/clear_unsaved_car` | Private | Remove all unsaved cars |

### Categories (`/`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/get_all_categories` | Public | Get all categories |
| GET | `/get_one_category/:id` | Public | Get a single category |
| GET | `/get_my_categories` | Private | Get categories created by the user |
| POST | `/add_category` | Private | Add a new category |
| PUT | `/update_category/:id` | Private | Update a category |
| DELETE | `/delete_category/:id` | Private | Delete a category |

---

## 📄 License

This project is for educational purposes.
