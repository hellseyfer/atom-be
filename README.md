# Task Manager API

A RESTful API built with Node.js, Express, TypeScript, and Firestore for managing tasks and users.

## Features

- User management (create and find by email)
- Task CRUD operations
- Data persistence with Google Firestore
- TypeScript support
- Environment-based configuration

## Prerequisites

- Node.js (v22 or later)
- npm or yarn
- firebase Configs

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   NODE_ENV=development
   JWT_SECRET=super-strong-random-string-here
   ```

4. Set up Firestore:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select an existing one
   - Go to Project Settings > Your Apps
   - Click on Add app
   - Copy and paste the configuration object into `firebase.config.ts`

## Running the Application

### Development

```bash
npm run dev
```

### Production

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the server:
   ```bash
   npm start
   ```

## API Endpoints
https://atom-be-nodejs-apd2cddzh6dzf2cx.canadacentral-01.azurewebsites.net/

### Users

- `POST /api/users` - Create a new user
  ```json
    {
    "email": "test2@example.com",
    "password": "Password123!"
    }
  ```

- `GET /api/users/:email` - Get user by email
- `POST /api/auth/login` - Login user and get token
  ```json
  {
    "email": "test@example.com",
    "password": "Password123!"
  }

  
  **Response:**
  ```json
  {
    "status": "success",
    "data": {
      "user": {
        "id": "JpVDMQhk28ZAEXdlcQ2F",
        "email": "test@example.com",
        "createdAt": "2025-09-13T23:53:33.230Z",
        "updatedAt": "2025-09-13T23:53:33.230Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```
### Tasks

- `POST /api/tasks` - Create a new task for a user
  ```json
  {
    "title": "Test User task",
    "description": "this is a description"
  }
  ```

- `GET /api/tasks` - Get all tasks for a user
- `GET /api/tasks/:id` - Get a specific task
- `PATCH /api/tasks/:id` - Update a task
  ```json
  {
    "title": "Updated title",
    "description": "Updated description",
    "completed": true
  }
  ```
- `DELETE /api/tasks/:id` - Delete a task

## Project Structure

```
src/
├── config/                 # Configuration files
│   ├── env.ts             # Environment configuration
│   └── firebase.config.ts  # Firebase configuration
│
├── features/               # Feature modules
│   ├── tasks/             # Task-related functionality
│   │   ├── controllers/   # Task controllers
│   │   ├── interfaces/    # Task interfaces
│   │   ├── services/      # Task business logic
│   │   └── validations/   # Task validation schemas
│   │
│   └── users/             # User-related functionality
│       ├── controllers/   # User controllers
│       ├── interfaces/    # User interfaces
│       ├── services/      # User business logic
│       └── validations/   # User validation schemas
│
├── middleware/             # Express middleware
│   ├── auth.middleware.ts  # Authentication middleware
│   ├── error.middleware.ts # Error handling middleware
│   └── validation.middleware.ts # Request validation
│
├── routes/                # Route definitions
│   ├── index.ts          # Main router
│   ├── task.routes.ts    # Task routes
│   └── user.routes.ts    # User routes
│
├── types/                 # Global type definitions
│   └── express/          # Express type extensions
│
├── app.ts                # Express application setup
└── server.ts             # Server entry point
```

## Testing

```bash
npm test
```

## Linting

```bash
npm run lint
```

## Formatting

```bash
npm run format
```
