# ecommerceAPI

A TypeScript Node.js RESTful backend for an e-commerce platform providing products, categories, users, reviews, coupons, addresses, wishlist, and RBAC with image handling and Redis caching.

## Table of Contents

- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation & Run](#installation--run)
- [Scripts](#scripts)
- [Project Structure](#project-structure)
- [Architecture & Flow](#architecture--flow)
- [Authentication & Authorization](#authentication--authorization)
- [Database & Caching](#database--caching)
- [Image Storage & Processing](#image-storage--processing)
- [Validation & Error Handling](#validation--error-handling)
- [Extending the API](#extending-the-api)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

ecommerceAPI is a modular backend that separates concerns into controllers, services, and repositories. It provides CRUD operations for products, categories, subcategories, reviews, coupons, and user-related features (profile, addresses, wishlist). It includes JWT-based auth and role-based access control (RBAC), optional Azure image storage support, and Redis caching utilities.

## Key Features

- User registration & JWT authentication
- Role-based access control (RBAC) and role seeding
- Product management with category/subcategory relationships
- Reviews (CRUD) with ownership checks
- Address management per user
- Coupons creation & validation
- Wishlist management
- Image uploading & optional Azure storage
- Redis integration for caching
- Clean separation: controllers → services → repositories

## Tech Stack

- Node.js + TypeScript
- Express.js
- MongoDB (Mongoose)
- Redis
- Multer (file uploads)
- Optional Azure Blob Storage for images

## Prerequisites

- Node.js (v16+ recommended)
- npm or yarn
- MongoDB instance (local or cloud)
- Redis instance (local or cloud)
- (Optional) Azure Storage account if using Azure for images

## Environment Variables

Create a `.env` file in the project root with values similar to:

```
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ecommerce
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
AZURE_STORAGE_ACCOUNT=your_account_name
AZURE_STORAGE_KEY=your_storage_key
AZURE_CONTAINER_NAME=images
```

Adjust names/values to match your deployment.

## Installation & Run

1. Install dependencies:

```bash
npm install
# or
yarn
```

2. Development start (with ts-node/ts-dev if configured):

```bash
npm run dev
```

3. Build and run production:

```bash
npm run build
npm start
```

The API entry point is `app.ts` and compiled output is placed in `distjs/` when built.

## Scripts

Check `package.json` for exact scripts. Typical scripts:

- `dev` — run in development (watch)
- `build` — compile TypeScript to JavaScript
- `start` — run compiled code
- `lint` / `test` — if configured in your `package.json`

## Project Structure (high-level)

- `app.ts` — application entry
- `config/` — DB and Redis connection utilities
- `routes/` — route definitions
- `controllers/` — request handlers
- `services/` — business logic
- `repositories/` — data access (Mongo implementations)
- `models/` — Mongoose schemas
- `dto/` — request/response DTOs
- `mappers/` — map models ↔ DTOs
- `middlewares/` — auth, validation, upload handlers
- `utils/` — helpers: `apiError`, `asyncWrapper`, JWT helpers, query parsers
- `composition/` — cross-cutting utilities (image processing, rbac, etc.)
- `distjs/` — compiled JavaScript output

## Architecture & Flow

- Routes receive requests and call controllers.
- Controllers validate and forward to services.
- Services implement business rules and call repositories for persistence.
- Repositories handle MongoDB-specific operations (via Mongoose).
- Middlewares handle authentication, authorization, validation, and file uploads.
- Utilities provide shared functionality like error classes and JWT generation.

## Authentication & Authorization

- JWT-based authentication; tokens created and validated by utilities in `utils/`.
- RBAC implemented with role definitions and seed scripts located in `rbac/`.
- Authorization middleware enforces role & ownership checks for protected routes.

## Database & Caching

- MongoDB stores primary data (users, products, reviews, coupons, etc.).
- Redis used for caching and fast key-value operations via connection in `config/redisConnection.ts`.

## Image Storage & Processing

- Local storage supported via upload middleware and `utils/storageFolder.ts`.
- Optional Azure Blob Storage integration in `services/azureStorage.ts`.
- Image processing utilities are in `composition/imageProcessor.ts` and `services/imageProcessing.ts`.

## Validation & Error Handling

- Request validation handled by middleware in `middlewares/validationHandler.ts`.
- Centralized error class `apiError` in `utils/apiError.ts`.
- Async route wrapper `utils/asyncWrapper.ts` simplifies error propagation.

## Extending the API

To add a new resource:

1. Add Mongoose `models/<resource>.ts`.
2. Create repository `repositories/mongo<Resource>.ts`.
3. Add service in `services/<resource>.ts`.
4. Add controller in `controllers/<resource>.ts`.
5. Define routes in `routes/<resource>.ts`.
6. Add DTOs and mappers under `dto/` and `mappers/` to shape requests/responses.

Follow existing folder patterns to keep consistency.

## Troubleshooting

- Mongo connection issues: verify `MONGO_URI` and network access; see `config/mongoConnection.ts`.
- Redis issues: validate `REDIS_URL` and ensure Redis service is running.
- Upload issues: validate multer config in `middlewares/uploads.ts` and storage paths in `utils/storageFolder.ts`.
- JWT/auth issues: check token generation and `JWT_SECRET`.

## Contributing

- Fork the repository, create a feature branch, add tests, and open a PR.
- Keep changes focused and follow TypeScript style used in the codebase.
- Document new endpoints and update this README where appropriate.

## API Documentation (suggested next step)

I can extract all routes and produce an endpoint list (method, path, controller, required auth) or generate an OpenAPI/Swagger spec or Postman collection if you want.

## License

Add a `LICENSE` file to the repository with your chosen license (MIT/Apache-2.0/etc.) if you plan to publish or share.
