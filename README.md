# Task Manager

A full-stack task management application built with the MERN stack (MongoDB, Express.js, React, Node.js). This application allows users to create projects, manage tasks, track progress, and collaborate with team members.

## Features

- **User Authentication**: Secure registration and login with JWT-based authentication
- **Role-Based Access Control**: Admin and user roles with different permissions
- **Project Management**: Create and manage multiple projects
- **Task Management**: 
  - Create, update, and delete tasks
  - Assign tasks to users
  - Set task priority (Low, Medium, High)
  - Track task status (Todo, In Progress, Done)
  - Set due dates for tasks
- **Dashboard**: Overview of projects and tasks with statistics
- **Responsive Design**: Built with Tailwind CSS for a mobile-friendly interface

## Tech Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcrypt** for password hashing
- **CORS** enabled

### Frontend
- **React** 19.2.0
- **Vite** for fast development and build
- **React Router** for navigation
- **Axios** for API requests
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **React Hot Toast** for notifications

## Project Structure

```
Task-manager-main/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── controllers/    # Route controllers
│   │   ├── middleware/     # Authentication & authorization
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── utils/          # Utility functions
│   ├── server.js           # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/            # API configuration
│   │   ├── components/     # React components
│   │   ├── context/        # Context providers
│   │   ├── layouts/        # Layout components
│   │   └── pages/          # Page components
│   ├── index.html
│   └── package.json
└── README.md
```

## Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Task-manager-main
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

Edit the `.env` file:

```env
VITE_API_URL=http://localhost:5000
```

## Running the Application

### Development Mode

**Backend:**
```bash
cd backend
npm run dev
```
The backend server will start on `http://localhost:5000`

**Frontend:**
```bash
cd frontend
npm run dev
```
The frontend application will start on `http://localhost:5173` (or another available port)

## API Documentation

### Base URL
```
http://localhost:5000
```

### Authentication Endpoints

#### Register User
```http
POST /auth/register
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (201 Created):**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john@example.com",
  "role": "user"
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Please provide name, email and password"
}
```

#### Login User
```http
POST /auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

---

### Project Endpoints

All project endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

#### Get All Projects
```http
GET /projects
```

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "title": "Website Redesign",
    "description": "Redesign company website with modern UI",
    "owner": "507f1f77bcf86cd799439012",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

#### Create Project
```http
POST /projects
```

**Request Body:**
```json
{
  "title": "Website Redesign",
  "description": "Redesign company website with modern UI"
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Website Redesign",
  "description": "Redesign company website with modern UI",
  "owner": "507f1f77bcf86cd799439012",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (400 Bad Request):**
```json
{
  "message": "Project title is required"
}
```

#### Get Project by ID
```http
GET /projects/:id
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Website Redesign",
  "description": "Redesign company website with modern UI",
  "owner": "507f1f77bcf86cd799439012",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Project not found"
}
```

#### Update Project
```http
PUT /projects/:id
```

**Request Body:**
```json
{
  "title": "Website Redesign - Updated",
  "description": "Updated description"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "title": "Website Redesign - Updated",
  "description": "Updated description",
  "owner": "507f1f77bcf86cd799439012",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T14:30:00.000Z"
}
```

#### Delete Project
```http
DELETE /projects/:id
```

**Response (200 OK):**
```json
{
  "message": "Project removed"
}
```

---

### Task Endpoints

All task endpoints require authentication. Include the JWT token in the Authorization header.

**Note:** Tasks are nested under projects in the API routes.

#### Get All Tasks for a Project
```http
GET /projects/:projectId/tasks
```

**Response (200 OK):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439013",
    "title": "Design Homepage",
    "description": "Create mockups for the homepage",
    "status": "In Progress",
    "priority": "High",
    "dueDate": "2024-01-20T00:00:00.000Z",
    "project": "507f1f77bcf86cd799439011",
    "assignedTo": {
      "_id": "507f1f77bcf86cd799439012",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Error Response (404 Not Found):**
```json
{
  "message": "Project not found or unauthorized"
}
```

#### Create Task
```http
POST /projects/:projectId/tasks
```

**Request Body:**
```json
{
  "title": "Design Homepage",
  "description": "Create mockups for the homepage",
  "status": "Todo",
  "priority": "High",
  "dueDate": "2024-01-20",
  "assignedTo": "507f1f77bcf86cd799439012"
}
```

**Response (201 Created):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "title": "Design Homepage",
  "description": "Create mockups for the homepage",
  "status": "Todo",
  "priority": "High",
  "dueDate": "2024-01-20T00:00:00.000Z",
  "project": "507f1f77bcf86cd799439011",
  "assignedTo": "507f1f77bcf86cd799439012",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Note:** If `assignedTo` is not provided, the task will be automatically assigned to the logged-in user.

**Error Response (400 Bad Request):**
```json
{
  "message": "Project ID is required"
}
```

#### Update Task
```http
PUT /tasks/:id
```

**Request Body:**
```json
{
  "title": "Design Homepage - Updated",
  "description": "Updated description",
  "status": "Done",
  "priority": "Medium",
  "dueDate": "2024-01-25",
  "assignedTo": "507f1f77bcf86cd799439015"
}
```

**Response (200 OK):**
```json
{
  "_id": "507f1f77bcf86cd799439013",
  "title": "Design Homepage - Updated",
  "description": "Updated description",
  "status": "Done",
  "priority": "Medium",
  "dueDate": "2024-01-25T00:00:00.000Z",
  "project": "507f1f77bcf86cd799439011",
  "assignedTo": "507f1f77bcf86cd799439015",
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T16:30:00.000Z"
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Task not found"
}
```

#### Delete Task
```http
DELETE /tasks/:id
```

**Authentication:** Requires **admin role**

**Response (200 OK):**
```json
{
  "message": "Task removed"
}
```

**Error Response (404 Not Found):**
```json
{
  "message": "Task not found"
}
```

---

### Dashboard Endpoints

#### Get Dashboard Statistics
```http
GET /dashboard
```

**Response (200 OK):**
```json
{
  "totalProjects": 5,
  "totalTasks": 23,
  "tasksByStatus": {
    "Todo": 8,
    "In Progress": 10,
    "Done": 5
  }
}
```

**Error Response (500 Internal Server Error):**
```json
{
  "message": "Failed to load dashboard stats"
}
```

---

### Error Responses

All endpoints may return the following error responses:

**400 Bad Request:**
```json
{
  "message": "Validation error message"
}
```

**404 Not Found:**
```json
{
  "message": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "message": "Error message"
}
```

---

## Database Models

### User Model
```javascript
{
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  createdAt: Date,    // Auto-generated by timestamps: true
  updatedAt: Date     // Auto-generated by timestamps: true
}
```

### Project Model
```javascript
{
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    maxlength: 500
  },
  owner: {
    type: ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: Date,    // Auto-generated by timestamps: true
  updatedAt: Date     // Auto-generated by timestamps: true
}
```

### Task Model
```javascript
{
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Todo', 'In Progress', 'Done'],
    default: 'Todo'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  dueDate: {
    type: Date
  },
  project: {
    type: ObjectId,
    ref: 'Project',
    required: true
  },
  assignedTo: {
    type: ObjectId,
    ref: 'User'
  },
  createdAt: Date,    // Auto-generated by timestamps: true
  updatedAt: Date     // Auto-generated by timestamps: true
}
```

## Environment Variables

### Backend (.env)
```env
PORT=5000                           # Server port
MONGO_URI=mongodb://localhost:27017/taskmanager  # MongoDB connection string
JWT_SECRET=your_super_secret_key_here            # JWT secret for token generation
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000  # Backend API URL
```

## Usage

1. **Register**: Create a new account on the registration page
2. **Login**: Sign in with your credentials
3. **Create Project**: Start by creating a new project
4. **Add Tasks**: Create tasks within your projects
5. **Manage Tasks**: Update task status, priority, and assignments
6. **Track Progress**: Monitor your projects and tasks on the dashboard

## Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-restart
```

### Frontend Development
```bash
cd frontend
npm run dev  # Uses Vite HMR
```

### Linting
```bash
cd frontend
npm run lint
```

## Security Features

- Password hashing with bcrypt
- JWT-based authentication
- Protected routes with middleware
- Role-based access control
- Input validation
- CORS configuration

## Testing the API

You can test the API using tools like:
- **Postman**: Import the endpoints and test manually
- **Thunder Client**: VS Code extension for API testing
- **cURL**: Command-line testing

Example cURL request:
```bash
# Register a new user
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securePassword123"
  }'

# Login
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securePassword123"
  }'

# Create a project (requires token)
curl -X POST http://localhost:5000/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "title": "My Project",
    "description": "Project description"
  }'
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Support

For support, please open an issue in the repository.

## Acknowledgments

- Built with the MERN stack
- UI designed with Tailwind CSS
- Icons from Lucide React
