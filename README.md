# Full-Stack Todo Application

A modern, responsive, and secure full-stack Todo application built with **Next.js**, **PostgreSQL 18**, **Prisma ORM**, and **Better Auth** for secure user authentication. Styled with a premium dark-themed custom UI (modeled after **shadcn/ui**) and **Tailwind CSS**.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL 18 (Docker Container)
- **ORM**: Prisma ORM
- **Authentication**: Better Auth (Email & Password provider)
- **Styling**: Tailwind CSS v4 & custom shadcn-style UI components
- **State Management**: Zustand

---

## 📋 Features

- **Authentication (`better-auth`)**:
  - Secure User Sign Up, Login, and Logout flows.
  - Page-level session verification: Only authenticated users can access the dashboard.
- **CRUD Operations**:
  - **Create**: Add new todos.
  - **Read**: List user-specific todos with filtering (`All`, `Active`, `Completed`).
  - **Update**: Edit todo text inline or toggle completion status.
  - **Delete**: Remove todos.
- **Security & Data Isolation**:
  - Enforced server-side checks: Users can *only* query, modify, or delete their own todos.
- **Premium UX/UI**:
  - Harmonious zinc/indigo theme with glassmorphism panels.
  - Live statistics count (Total, Active, Done).
  - Hover states, loading indicators, form validation, and error alerts.

---

## 🚀 Getting Started

Follow these step-by-step instructions to get the application running locally.

### 1. Prerequisites

Make sure you have the following installed on your machine:
- **Node.js** (v18.x or later)
- **Docker** and **Docker Compose**

### 2. Environment Setup

Create a `.env` file in the root directory. You can copy the template from `.env.example`:

```bash
cp .env.example .env
```

The default contents of `.env` are configured to connect to the Docker container:

```env
# Database connection string pointing to port 5433 (PostgreSQL Docker container)
DATABASE_URL="postgresql://postgres:password@localhost:5433/todo_db?schema=public"

# Better Auth Secret (should be a secure random string, minimum 32 characters)
BETTER_AUTH_SECRET="a_very_secure_and_random_string_of_32_characters_minimum_for_better_auth"

# Base URLs
BETTER_AUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Spin Up PostgreSQL (Docker)

Start the PostgreSQL 18 server container in the background:

```bash
docker compose up -d
```

To stop the container later, run `docker compose down`. To clean up persistent volumes as well, run `docker compose down -v`.

### 4. Database Schema Sync

Generate the Prisma Client and sync the database schema with Postgres:

```bash
# Generate Prisma Client
npx prisma generate

# Sync the schema to PostgreSQL (creates User, Session, Account, Verification, and Todo tables)
npx prisma db push
```

### 5. Install Dependencies

If you need to restore packages:

```bash
npm install
```

### 6. Run the Development Server

Start the Next.js app in development mode:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application!

---

## 🔒 Security Constraints

Data isolation is enforced at the database layer and in the Next.js Route Handlers:
- **`app/api/todos/route.ts`**: Verifies the user session via `auth.api.getSession` and filters all queries by the authenticated user's `userId`.
- **`app/api/todos/[id]/route.ts`**: Ensures that the todo item exists and its `userId` matches the session user's ID before performing `PUT` or `DELETE` operations. Unauthenticated requests return `401 Unauthorized` and forbidden access attempts return `403 Forbidden`.
