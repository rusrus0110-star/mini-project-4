# Task Manager API

A REST API for user authentication and task management built with Node.js, Express, MongoDB, and Mongoose.

## Features

- User registration and login
- Password hashing with bcrypt
- JWT authentication
- Protected routes
- Create, read, update, and delete tasks
- Filter tasks by status and creation date
- Pagination and sorting
- Centralized error handling

## Technologies

- Node.js
- Express
- MongoDB
- Mongoose
- JSON Web Token
- bcrypt

## Installation

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

Start the development server:

```bash
npm run dev
```

## API Endpoints

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me
```

### Tasks

```text
POST   /api/tasks
GET    /api/tasks
GET    /api/tasks/:task_id
PUT    /api/tasks/:task_id
DELETE /api/tasks/:task_id
```

Protected routes require a JWT:

```text
Authorization: Bearer <token>
```

## Task Filters

```text
GET /api/tasks?status=pending
GET /api/tasks?from_date=2026-06-01&to_date=2026-06-30
GET /api/tasks?page=1&limit=10&sort=newest
```
