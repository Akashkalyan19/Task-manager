# Task Management System - Frontend

A refined, simple, and easy-to-understand React frontend for the Task Management System.

## Features

- **User Authentication**: Register, Login, Logout using JWT.
- **Dashboard**: View project statistics and list of projects.
- **Projects**: Create, View, and Delete projects.
- **Tasks**: Kanban-style task board (Todo, In Progress, Done) with priority management.
- **Responsive Design**: Built with Tailwind CSS.

## Tech Stack

- React (Vite)
- Tailwind CSS
- React Router DOM
- Axios
- React Hot Toast (Notifications)
- Lucide React (Icons)

## Setup Instructions

1.  **Prerequisites**: Ensure the backend server is running on `http://localhost:5000`.
2.  **Install Dependencies**:
    ```bash
    cd frontend
    npm install
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
4.  **Build for Production**:
    ```bash
    npm run build
    ```

## Project Structure

- `src/api`: API integration logic.
- `src/context`: Auth context provider.
- `src/pages`: Main application pages (Login, Dashboard, etc.).
- `src/components`: Reusable components (ProtectedRoute, etc.).
- `src/layouts`: Layout wrappers.
