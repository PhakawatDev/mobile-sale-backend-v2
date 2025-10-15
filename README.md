# Mobile Sale Backend v2

## Overview
Mobile Sale Backend v2 is a TypeScript Express service that powers product, company, user, service, and sales management workflows for a mobile sales platform. It layers cross-cutting middleware for security, logging, and request tracing before exposing all business routes under the `/api` prefix. Data access is handled with Prisma repositories connected to the configured database, keeping persistence concerns isolated from the request pipeline.

## Features
- **Robust HTTP pipeline** – Express application configured with request ID assignment, Helmet, CORS, compression, JSON body parsing, centralized logging, and a global error handler.
- **Modular routing** – `/api` router composes company, product, user, service, and sales modules for clear domain separation.
- **Company management** – Create or fetch company records for configuration data required by client applications.
- **Inventory workflows** – Endpoints to list in-stock items, fetch paginated results, update products, perform soft deletes, and export inventory to Excel for reporting.
- **User authentication & profiles** – Sign-in issues JWT tokens using the configured secret key, while protected endpoints expose user info, profile updates, CRUD operations, and soft deletion.
- **Service catalog** – Manage ancillary services with create, list, update, and remove endpointsใ
- **Sales lifecycle** – Track sales through creation, listing, removal, confirmation, dashboard summaries, history, and per-sale detail lookups.
- **Structured logging** – Winston-based logger with environment-aware formatting and configurable log level via environment variables.

## Prerequisites
- Node.js and npm installed locally (the project is distributed as an npm package and uses npm scripts for development tooling).
- Access to a MongoDB instance reachable through Prisma (configure the `DATABASE_URL` value accordingly).

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file (or configure environment variables in your deployment target) using the provided `backup.env.development` file as a reference. Key variables include:

   | Variable | Description |
   | --- | --- |
   | `DATABASE_URL` | Connection string used by Prisma clients to reach the backing database. |
   | `PORT` | Port the HTTP server listens on (defaults to 3000 when unset). |
   | `NODE_ENV` | Selects development or production behavior for logging and middleware. |
   | `SECRET_KEY` | Secret used to sign and validate JWTs for user authentication flows.|
   | `JWT_SECRET` | Optional secret for other auth flows that read from the shared config module. |
   | `LOG_LEVEL` | Controls the verbosity of application logs.|

3. Run Prisma migrations or `prisma db push` to sync the schema to your database (the application expects Prisma models to exist before handling requests).
   
## Development
- Start the development server with hot reload:
  ```bash
  npm run dev
  ```
  This runs `ts-node` via `nodemon`, recompiling on file changes.
- Compile TypeScript to JavaScript:
  ```bash
  npm run build
  ```
  Uses the TypeScript compiler to emit production-ready output into the `dist` directory.
- Launch the compiled build:
  ```bash
  npm start
  ```
  Executes the compiled server from `dist/server.js`.

## API Overview
All routes are mounted under the `/api` prefix. Combine the prefix with the module-specific paths below when invoking the service.

| Module | Base Path | Highlights |
| --- | --- | --- |
| Company | `/api/company` | Create company metadata and fetch the current configuration. |
| Products | `/api/buy` | Inventory listing, pagination, updates, removals, and Excel export. |
| Users | `/api/user` | JWT-based sign-in, profile info, updates, CRUD management, and soft deletes. |
| Services | `/api/service` | Create, list, update, or remove service catalog entries. |
| Sales | `/api/sell` | Create sales, manage confirmations, retrieve dashboards, history, and per-sale details. |

## Logging
The `AppLogger` wrapper builds on Winston to provide class-scoped logging with JSON output in production and colorful console logs in development. Configure verbosity through the `LOG_LEVEL` variable and capture rotating log files when `NODE_ENV=production`.
## Scripts Reference
All available npm scripts are defined in `package.json` for quick reference and automation.

