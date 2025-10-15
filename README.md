# Mobile Sale Backend v2

## Overview
Mobile Sale Backend v2 is a TypeScript Express service that powers product, company, user, service, and sales management workflows for a mobile sales platform. It layers cross-cutting middleware for security, logging, and request tracing before exposing all business routes under the `/api` prefix.【F:src/app.ts†L13-L36】 Data access is handled with Prisma repositories connected to the configured database, keeping persistence concerns isolated from the request pipeline.【F:src/modules/company/company.repository.ts†L1-L26】

## Features
- **Robust HTTP pipeline** – Express application configured with request ID assignment, Helmet, CORS, compression, JSON body parsing, centralized logging, and a global error handler.【F:src/app.ts†L16-L36】
- **Modular routing** – `/api` router composes company, product, user, service, and sales modules for clear domain separation.【F:src/app.ts†L32-L36】【F:src/routes/index.ts†L8-L14】
- **Company management** – Create or fetch company records for configuration data required by client applications.【F:src/modules/company/company.router.ts†L11-L13】
- **Inventory workflows** – Endpoints to list in-stock items, fetch paginated results, update products, perform soft deletes, and export inventory to Excel for reporting.【F:src/modules/product/product.router.ts†L8-L12】
- **User authentication & profiles** – Sign-in issues JWT tokens using the configured secret key, while protected endpoints expose user info, profile updates, CRUD operations, and soft deletion.【F:src/modules/user/user.router.ts†L8-L14】【F:src/modules/user/user.service.ts†L19-L155】
- **Service catalog** – Manage ancillary services with create, list, update, and remove endpoints.【F:src/modules/service/service.router.ts†L7-L10】
- **Sales lifecycle** – Track sales through creation, listing, removal, confirmation, dashboard summaries, history, and per-sale detail lookups.【F:src/modules/sell/sell.router.ts†L8-L14】
- **Structured logging** – Winston-based logger with environment-aware formatting and configurable log level via environment variables.【F:src/core/logger/logger.ts†L1-L96】

## Prerequisites
- Node.js and npm installed locally (the project is distributed as an npm package and uses npm scripts for development tooling).【F:package.json†L1-L39】
- Access to a MongoDB instance reachable through Prisma (configure the `DATABASE_URL` value accordingly).【F:src/modules/company/company.repository.ts†L1-L26】【F:src/config/index.ts†L8-L10】

## Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create a `.env` file (or configure environment variables in your deployment target) using the provided `backup.env.development` file as a reference. Key variables include:

   | Variable | Description |
   | --- | --- |
   | `DATABASE_URL` | Connection string used by Prisma clients to reach the backing database.【F:src/config/index.ts†L8-L10】【F:backup.env.development†L1-L1】 |
   | `PORT` | Port the HTTP server listens on (defaults to 3000 when unset).【F:src/config/index.ts†L4-L7】【F:backup.env.development†L4-L4】 |
   | `NODE_ENV` | Selects development or production behavior for logging and middleware.【F:src/config/index.ts†L4-L6】【F:src/core/logger/logger.ts†L6-L57】【F:backup.env.development†L6-L6】 |
   | `SECRET_KEY` | Secret used to sign and validate JWTs for user authentication flows.【F:src/modules/user/user.service.ts†L35-L95】【F:backup.env.development†L2-L2】 |
   | `JWT_SECRET` | Optional secret for other auth flows that read from the shared config module.【F:src/config/index.ts†L11-L13】 |
   | `LOG_LEVEL` | Controls the verbosity of application logs.【F:src/core/logger/logger.ts†L6-L63】【F:backup.env.development†L7-L7】 |

3. Run Prisma migrations or `prisma db push` to sync the schema to your database (the application expects Prisma models to exist before handling requests).【F:src/modules/company/company.repository.ts†L1-L26】

## Development
- Start the development server with hot reload:
  ```bash
  npm run dev
  ```
  This runs `ts-node` via `nodemon`, recompiling on file changes.【F:package.json†L5-L8】
- Compile TypeScript to JavaScript:
  ```bash
  npm run build
  ```
  Uses the TypeScript compiler to emit production-ready output into the `dist` directory.【F:package.json†L5-L8】
- Launch the compiled build:
  ```bash
  npm start
  ```
  Executes the compiled server from `dist/server.js`.【F:package.json†L5-L8】

## API Overview
All routes are mounted under the `/api` prefix. Combine the prefix with the module-specific paths below when invoking the service.【F:src/app.ts†L32-L36】【F:src/routes/index.ts†L8-L14】

| Module | Base Path | Highlights |
| --- | --- | --- |
| Company | `/api/company` | Create company metadata and fetch the current configuration.【F:src/modules/company/company.router.ts†L11-L13】 |
| Products | `/api/buy` | Inventory listing, pagination, updates, removals, and Excel export.【F:src/modules/product/product.router.ts†L8-L12】 |
| Users | `/api/user` | JWT-based sign-in, profile info, updates, CRUD management, and soft deletes.【F:src/modules/user/user.router.ts†L8-L14】【F:src/modules/user/user.service.ts†L19-L155】 |
| Services | `/api/service` | Create, list, update, or remove service catalog entries.【F:src/modules/service/service.router.ts†L7-L10】 |
| Sales | `/api/sell` | Create sales, manage confirmations, retrieve dashboards, history, and per-sale details.【F:src/modules/sell/sell.router.ts†L8-L14】 |

## Logging
The `AppLogger` wrapper builds on Winston to provide class-scoped logging with JSON output in production and colorful console logs in development. Configure verbosity through the `LOG_LEVEL` variable and capture rotating log files when `NODE_ENV=production`.【F:src/core/logger/logger.ts†L6-L96】

## Scripts Reference
All available npm scripts are defined in `package.json` for quick reference and automation.【F:package.json†L5-L8】

