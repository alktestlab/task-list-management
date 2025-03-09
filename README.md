# Task List Management

A task management application built with Next.js, TypeScript, Material UI, Tailwind CSS, and Prisma ORM.

## Features

- Add, edit, and delete tasks
- Search tasks by title or description
- Filter tasks by status
- Responsive design for mobile and desktop
- Material UI components with Tailwind CSS for styling
- SQLite database with Prisma ORM

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **UI Components**: Material UI
- **Styling**: Tailwind CSS
- **API**: Next.js API Routes
- **Database**: SQLite
- **ORM**: Prisma
- **Deployment**: Kubernetes on GCP (planned)

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/alktestlab/task-list-management.git
cd task-list-management
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Set up the database:

```bash
npx prisma migrate dev
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

- `/prisma` - Prisma schema and migrations
- `/src/app` - Next.js app router pages and API routes
- `/src/components` - React components
- `/src/types` - TypeScript type definitions

## API Endpoints

- `GET /api/tasks` - Get all tasks (with optional search and filter)
- `POST /api/tasks` - Create a new task
- `GET /api/tasks/:id` - Get a specific task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

## Deployment

### Kubernetes on GCP

Instructions for deploying to Kubernetes on GCP will be added in the future.

## License

This project is licensed under the MIT License.
