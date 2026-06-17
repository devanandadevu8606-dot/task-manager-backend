# Task Manager Backend API (Phase 1)

A production-ready RESTful API backend for a Task Manager application built using **Node.js, Express.js, MongoDB (Mongoose), JWT, and bcrypt**.

---

## 📁 Project Structure

```text
task-manager-backend/
│
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   │
│   ├── controllers/
│   │   ├── authController.js     # User registration and login logic
│   │   └── taskController.js     # User-specific Task CRUD logic
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification & req.user injection
│   │   └── errorMiddleware.js    # Global error & Mongoose exception handler
│   │
│   ├── models/
│   │   ├── User.js               # User Schema (with bcrypt save hooks)
│   │   └── Task.js               # Task Schema (linked to User model)
│   │
│   ├── routes/
│   │   ├── authRoutes.js         # Authentication endpoints
│   │   └── taskRoutes.js         # Task CRUD endpoints (protected)
│   │
│   ├── seed/
│   │   └── seedTasks.js          # Database seeding script
│   │
│   ├── app.js                    # Express app configuration
│   └── server.js                 # Server entry point & process listeners
│
├── .env                          # Local environment variables
├── package.json                  # Node dependencies & npm scripts
└── README.md                     # Documentation
```

---

## 🚀 Installation & Setup

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local Community Server running on `127.0.0.1:27017` **or** a MongoDB Atlas cluster)

### 2. Installation
Clone or navigate to the workspace directory and install dependencies:
```bash
# Install NPM dependencies
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory (already created) with the following structure:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/taskmanager
JWT_SECRET=my_ultra_secure_jwt_secret_key_2026_antigravity
JWT_EXPIRE=30d
```

> [!NOTE]
> If using **MongoDB Atlas**, change the `MONGO_URI` to your Atlas connection string (e.g., `mongodb+srv://<username>:<password>@cluster.mongodb.net/taskmanager?retryWrites=true&w=majority`).

---

## 🛠️ Running the Application

### Start Development Server
Starts the API with `nodemon` for automatic server reloading on code changes:
```bash
npm run dev
```

### Start Production Server
Starts the API with standard Node execution:
```bash
npm start
```

### Database Seeding
Inserts a test user (`seeduser@example.com` / `password123`) and 5 sample tasks linked to that user:
```bash
npm run seed
```

---

## 🧪 Postman Endpoint & Testing Guide

Import these details into Postman to test the workflow sequentially.

### Step 1: Health Check (Public)
- **Request**: `GET http://localhost:5000/api/health`
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "status": "OK",
    "timestamp": "2026-06-12T12:00:00.000Z",
    "env": "development"
  }
  ```

---

### Step 2: Authentication

#### A. User Registration (Public)
- **Request**: `POST http://localhost:5000/api/auth/register`
- **Headers**: `Content-Type: application/json`
- **Body** (JSON):
  ```json
  {
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "secretpassword"
  }
  ```
- **Response**: `201 Created`
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "_id": "648f...",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "token": "eyJhbGciOi..."
    }
  }
  ```

#### B. User Login (Public)
- **Request**: `POST http://localhost:5000/api/auth/login`
- **Headers**: `Content-Type: application/json`
- **Body** (JSON):
  ```json
  {
    "email": "johndoe@example.com",
    "password": "secretpassword"
  }
  ```
- **Response**: `200 OK`
  *(Copy the `token` from this response. You will need it to authorize subsequent task requests.)*

---

### Step 3: Task CRUD Operations (Protected)

For all requests below, you must attach the JWT token in the **Headers** as follows:
- **Header Key**: `Authorization`
- **Header Value**: `Bearer <YOUR_JWT_TOKEN>`

#### A. Create a Task
- **Request**: `POST http://localhost:5000/api/tasks`
- **Body** (JSON):
  ```json
  {
    "title": "Complete Phase 1 Project",
    "description": "Ensure Express, Mongoose, and Authentication endpoints work.",
    "status": "pending",
    "priority": "high",
    "dueDate": "2026-06-20"
  }
  ```
- **Response**: `201 Created`

#### B. Get User-specific Tasks
- **Request**: `GET http://localhost:5000/api/tasks`
- **Response**: `200 OK` (Returns only tasks created by the logged-in user)

#### C. Get Task by ID
- **Request**: `GET http://localhost:5000/api/tasks/<task_id>`
- **Response**: `200 OK` (Or `403 Forbidden` if you try to fetch another user's task)

#### D. Update Task
- **Request**: `PUT http://localhost:5000/api/tasks/<task_id>`
- **Body** (JSON):
  ```json
  {
    "status": "completed",
    "priority": "medium"
  }
  ```
- **Response**: `200 OK`

#### E. Delete Task
- **Request**: `DELETE http://localhost:5000/api/tasks/<task_id>`
- **Response**: `200 OK`

---

## ⚠️ Common Errors & Fixes

### 1. Database Connection Failure (`ECONNREFUSED`)
- **Symptoms**: Console outputs: `Database Connection Error: connect ECONNREFUSED 127.0.0.1:27017`
- **Root Cause**: The local MongoDB service is not started or running on the machine.
- **Fixes**:
  - Run MongoDB locally: On Windows, open Command Prompt as Administrator and run `net start MongoDB` (if MongoDB is installed as a service), or run `mongod --dbpath <path_to_data_folder>`.
  - Switch to MongoDB Atlas: Update the `MONGO_URI` value in `.env` to point to a MongoDB Atlas cluster URI.

### 2. Authentication Failures (`Not authorized, token failed`)
- **Symptoms**: Request returns status `401 Unauthorized` with message `Not authorized, token failed` or `Not authorized, no token provided`.
- **Root Cause**: The JWT token was missing, formatted incorrectly, or expired.
- **Fixes**:
  - Ensure the header is named `Authorization` (spelled correctly).
  - Ensure the header value has the exact format `Bearer <token>` (with a space separating "Bearer" and the token).
  - Re-login to generate a fresh token if the token expired.

### 3. Resource ID Format Issues (`Resource not found with id of...`)
- **Symptoms**: Status `404 Not Found` with CastError details in message.
- **Root Cause**: The string sent in the URL as the ID does not follow the MongoDB 24-character hexadecimal format.
- **Fixes**: Verify that the task ID copied into the route path matches the `_id` field returned by the create/read task requests.

---

## 🎯 Recommended Next Steps & Optional Improvements

### 🚀 1. Pagination & Filtering
To support large databases, implement pagination and status filtering on the `GET /api/tasks` endpoint:
- **Filtering**: Allow queries like `GET /api/tasks?status=completed` or `GET /api/tasks?priority=high` by extracting queries using `req.query`.
- **Pagination**: Use `limit` and `skip` parameters (e.g. `GET /api/tasks?page=1&limit=10`) inside the controller:
  ```javascript
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const startIndex = (page - 1) * limit;
  const tasks = await Task.find({ createdBy: req.user._id }).skip(startIndex).limit(limit);
  ```

### ☁️ 2. Deployment to Render
To deploy your backend to [Render](https://render.com/):
1. Create a repository on GitHub and commit your code (exclude `node_modules` and `.env` using a `.gitignore` file).
2. Register an account on Render and link your GitHub account.
3. Click **New** -> **Web Service**.
4. Set the **Build Command** to `npm install`.
5. Set the **Start Command** to `npm start`.
6. Add your Environment Variables in the Render Dashboard under the **Environment** tab:
   - `NODE_ENV=production`
   - `MONGO_URI=<your_mongodb_atlas_uri>`
   - `JWT_SECRET=<your_production_secret>`
7. Render will build and deploy your service, providing a public `onrender.com` URL.
