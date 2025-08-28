# Digital Wallet System Backend

## Project Overview
The **Digital Wallet Backend System** is a secure and modular backend system built with **Express.js**, **Mongoose** and **TypeScript**, inspired by digital wallet platforms like **BKash** or **Nagad**. It supports **role-based access** for **users**, **agents**, and **admins**, allowing transactions such as money transfer, cash-in and cash-out.

> **Live Link**: [https://digital-wallet-server-alpha.vercel.app](https://digital-wallet-server-alpha.vercel.app)
> **Client Repository**: [https://github.com/margubmurshed/digital-wallet-system-client](https://github.com/margubmurshed/digital-wallet-system-client)

---

## Features
- ☑️ **JWT Authentication** with secure password hashing using mongoose pre save hook
- ☑️ **Role-based Authorization** (`user`, `agent`, `admin`)
- ☑️ **Auto Wallet Creation** during registration (initial balance : 50 Taka)
- ☑️ **User Features**: Add Money, withdraw money, send money, cash out
- ☑️ **Agent Features**: Cash-in, view commissions
- ☑️ **Admin Features**: View, update, approve, block users and agents and their wallets
- ☑️ **Transaction History** with commission tracking
- ☑️ **Auto Wallet Status Update**: 
    - disapproving or blocking user leads to automatic wallet blockage.
    - User status -> "ACTIVE" and User Approval -> true, both need to happen in order to make wallet active.
    - Updating user role to admin/superadmin updates user wallet status to "BLOCKED"


## Tech Stack
- **Backend**: Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT, bcrypt, passport.js
- **Validation**: Zod
- **Others**: TypeScript, dotenv, 

---

## API Endpoints (Base URL: `/api/v1`)

### 🔐 Auth (`/auth`)

|Method|Endpoint|Description|
|------|--------|-----------|
|POST|`/auth/login`|Login and get JWT token|
|POST|`/auth/register`|Register user/agent|

### 👤 Users & Agents  (`/user`)

|Method|Endpoint|Role(s)|Description|
|------|--------|-----------|-----------|
|GET|`/user/`| Admin/Super Admin | Get all users irrespective of any role|
|GET|`/user/users`|Admin/Super Admin |Get all users|
|GET|`/user/agents`|Admin/Super Admin |Get all agents|
|GET|`/user/me`|All Roles |Get own profile|
|GET|`/user/:id`|Admin/Super Admin|Get single user by ID|
|PATCH|`/user/:id`|All Roles|Update user information|
|PATCH|`/user/:id/approve`|Admin/Super Admin|Approve user or agent|
|PATCH|`/user/:id/disapprove`|Admin/Super Admin|Disapprove user or agent|

---

### 💴 Wallet (`/wallet`)

|Method|Endpoint|Role(s)|Description|
|------|--------|-----------|-----------|
|POST|`/wallet/add-money`| User | Add money to wallet|
|POST|`/wallet/withdraw`|User |Withdraw money from wallet|
|POST|`/wallet/send-money`|User |Send money to another user|
|POST|`/wallet/cash-in`|Agent|Agent cash-in to user|
|POST|`/wallet/cash-out`|User|Cash-out via agent|
|GET|`/wallet/me`|User/Agent|View own wallet info|
|GET|`/wallet/me/commission`|Agent|View total earned commission|
|GET|`/wallet/:id`|Admin/Super Admin|View wallet by user ID|
|PATCH|`/wallet/:id/block`|Admin/Super Admin|Block wallet|
|PATCH|`/wallet/:id/unblock`|Admin/Super Admin|Unblock wallet|

---

### 📄 Transaction (`/transaction`)

|Method|Endpoint|Role(s)|Description|
|------|--------|-----------|-----------|
|GET|`/transaction/`| Admin/Super Admin | View all transactions|
|GET|`/transaction/me`|User/Agent |View own transaction history|

---

## Setup Instruction

1. **Clone the repo**
   ```bash
       git clone https://github.com/margubmurshed/digital-wallet-system.git
       cd digital-wallet-system
   ```
2. Install Dependencies
   ```nginx
       npm install -f
   ```
3. Configure Environment Variables
   Create a .env file in the root directory and add the following:
   ```ini
        DB_URL=mongodb+srv://<DB_USERNAME>:<DB_PASSWORD>@cluster0.hrq6pyr.mongodb.net/digitalWalletDB?retryWrites=true&w=majority&appName=Cluster0
        PORT=5000
        NODE_ENV=development
        JWT_ACCESS_SECRET=ACCESS_SECRET
        JWT_ACCESS_EXPIRES=EXPIRY_TIME
        JWT_REFRESH_SECRET=REFRESH_SECRET
        JWT_REFRESH_EXPIRES=EXPIRY_TIME
        BCRYPT_SALT_ROUND=INT_NUMBER
        SUPER_ADMIN_PHONE=PHONE_NUMBER
        SUPER_ADMIN_PASS=PASSWORD
        TRANSACTION_FEE_PERCENTAGE=NUMBER
        DEFAULT_AGENT_COMMISSION_RATE=NUMBER```
4. Run the development server
   ```bash
        npm run dev
   ```

5. Open Postman or Browser and hit:
    ```bash
        http://localhost:5000/api/v1
   ```
---

## Developed By
**Margub Murshed**
*Full Stack Developer*
