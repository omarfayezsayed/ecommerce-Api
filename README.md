# ecommerceAPI

Professional e-commerce backend API built with TypeScript and Express, designed with modular architecture and resource-oriented endpoints.

The platform supports authentication, catalog management, reviews, wishlist, cart, coupons, addresses, and a transactional order workflow with both cash and Stripe card payments.

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Tools and Integrations](#tools-and-integrations)
- [API Resources and Functionalities](#api-resources-and-functionalities)
- [Authentication and Authorization](#authentication-and-authorization)
- [Order and Payment Behavior](#order-and-payment-behavior)
- [Architecture and Design Patterns](#architecture-and-design-patterns)
- [Environment Variables](#environment-variables)
- [Run and Scripts](#run-and-scripts)
- [Notes and Caveats](#notes-and-caveats)

## Overview

This API follows a clean layered architecture and exposes REST endpoints grouped by business resources.

- Focus on clear business boundaries (Auth, Users, Products, Cart, Orders, etc.)
- Permission-based access control (RBAC)
- DTO-based request validation
- Transaction-safe order processing

## Tech Stack

- Node.js
- TypeScript
- Express.js
- MongoDB (Mongoose)
- Redis
- Passport.js (JWT + Google OAuth)
- Stripe
- Azure Blob Storage
- Multer
- Sharp
- class-validator
- class-transformer
- Nodemailer

## Tools and Integrations

- MongoDB for persistent data
- Redis for temporary data and caching scenarios
- Stripe for card checkout and webhook payment confirmation
- Azure Blob Storage for image storage
- Sharp for image processing and optimization
- Nodemailer for email workflows

## API Resources and Functionalities

### Auth

- Register with email/password
- Login with email/password
- Refresh token
- Logout
- Google login (OAuth)
- Verify email
- Resend verification code
- Forget password
- Reset password

### Users

- Create user
- Read profile/current user
- Read users list
- Read user by id
- Update profile/user
- Change password
- Upload/update profile image
- Delete user

### Brands

- Create brand
- List brands
- Get brand details
- Update brand
- Delete brand

### Categories

- Create category
- List categories
- Get category details
- Update category
- Delete category

### Subcategories

- Create subcategory
- List subcategories
- Get subcategory details
- Update subcategory
- Delete subcategory

### Products

- Create product
- List products
- Get product details
- Update product
- Delete product
- Add product images
- Add/update/delete sizes
- Add/update/delete variants
- Add/update/delete variant sizes
- Add images to variants

### Reviews

- Create review
- List reviews
- Get review details
- Update review
- Delete review

### Coupons

- Create coupon
- List coupons
- Get coupon details
- Update coupon
- Delete coupon
- Validate coupon code

### Wishlist

- Add product to wishlist
- Get wishlist
- Remove product from wishlist
- Clear wishlist

### Addresses

- Create address
- List user addresses
- Get address by id
- Update address
- Delete address

### Cart

- Get current cart
- Add item to cart
- Update item quantity
- Remove item from cart
- Apply coupon to cart
- Remove coupon from cart

### Orders

- Place order
- List user orders
- Get order details
- Update order status
- Delete order
- Stripe webhook handler for payment confirmation

### Docs

- Interactive API docs endpoint
- OpenAPI yaml endpoint

## Authentication and Authorization

- JWT-based authentication for protected endpoints
- Google OAuth login support
- RBAC permissions on resource actions (create/read/update/delete and custom actions)

## Order and Payment Behavior

- Supported statuses: pending, confirmed, shipped, delivered

Cash payment:

- Order is created as confirmed
- Stock is reserved immediately
- Cart is cleared in the same transaction

Card payment:

- Stripe Checkout session is created
- Order is created as pending
- Checkout URL is returned to the client
- Stock reservation happens after successful Stripe webhook

Webhook success behavior:

- Reserve stock
- Mark order as paid and confirmed
- Clear cart
- Run in a transaction for consistency

## Architecture and Design Patterns

Architecture style:

- Layered architecture (Routes -> Controllers -> Services -> Repositories -> Models)

Patterns used:

- Repository Pattern
- Service Layer Pattern
- Composition Root / Dependency Injection
- Strategy Pattern (payment strategy & validation of Products)
- Factory Pattern (product type validation)
- Chain of Responsibility (error handling)
