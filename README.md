# Task Manager API

A RESTful API built with Node.js, Express, TypeScript, and Firestore for managing tasks and users.

## Features

- User management (create and find by email)
- Task CRUD operations
- Data persistence with Google Firestore
- TypeScript support
- Environment-based configuration

## Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Google Cloud project with Firestore enabled
- Service account key file from Firebase

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
   ```

4. Set up Firestore:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select an existing one
   - Go to Project Settings > Service Accounts
   - Click "Generate New Private Key" and save it as `serviceAccountKey.json` in the project root

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

### Users

- `POST /api/users` - Create a new user
  ```json
  {
    "email": "user@example.com"
  }
  ```

- `GET /api/users/:email` - Get user by email

### Tasks

- `POST /api/users/:userId/tasks` - Create a new task for a user
  ```json
  {
    "title": "Task title",
    "description": "Task description"
  }
  ```

- `GET /api/users/:userId/tasks` - Get all tasks for a user
- `GET /api/users/:userId/tasks/:id` - Get a specific task
- `PATCH /api/users/:userId/tasks/:id` - Update a task
  ```json
  {
    "title": "Updated title",
    "description": "Updated description",
    "completed": true
  }
  ```
- `DELETE /api/users/:userId/tasks/:id` - Delete a task

## Project Structure

```
src/
├── config/           # Configuration files
├── controllers/      # Request handlers
├── interfaces/       # TypeScript interfaces
├── middleware/       # Express middleware
├── routes/          # Route definitions
├── services/        # Business logic
├── app.ts           # Express application
└── server.ts        # Server entry point
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
