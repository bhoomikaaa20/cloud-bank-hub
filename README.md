# 🏦 Cloud-Based Digital Banking System

A full-stack **Digital Banking Application** built using **MERN (MongoDB, Express, React, Node.js) with TypeScript**, enabling secure account management, money transfers, transaction tracking, and admin controls.

---

## 🚀 Features

### 👤 Authentication & Authorization

* User signup & login with JWT authentication
* Role-based access (User / Admin)
* Protected routes (frontend + backend)

---

### 💳 Account Management

* Automatic account creation on signup
* Default balance initialization ($1000)
* Fetch user account balance
* Unique account numbers

---

### 💸 Money Transfer

* Transfer money between users
* Balance validation before transfer
* Transaction recording
* Real-time balance updates

---

### 🔔 Notifications System

* Notifications triggered on receiving money
* Unread notification count
* Mark notifications as read

---

### 📊 Transactions

* View all transactions (credit/debit)
* Filter by:

  * All
  * Credit
  * Debit
* Search transactions by name or note

---

### 🛠️ Admin Panel

* View all users
* View all transactions
* Delete users and transactions
* System-wide balance overview

---

## 🧱 Tech Stack

### Frontend

* React (Vite)
* TypeScript
* Tailwind CSS
* TanStack Router

### Backend

* Node.js
* Express.js
* TypeScript
* MongoDB (Mongoose)
* JWT Authentication

---

## 📁 Project Structure

```
cloud-bank-hub/
│
├── client/                # React Frontend
│   ├── components/
│   ├── routes/
│   ├── hooks/
│   └── lib/
│
├── server/                # Backend (Node + Express)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── server.ts
```

---

## ⚙️ Setup Instructions

### 🔹 1. Clone the repository

```bash
git clone <your-repo-url>
cd cloud-bank-hub
```

---

### 🔹 2. Setup Backend

```bash
cd server
npm install
```

Create `.env` file:

```env
PORT=5000
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
```

Run backend:

```bash
npm run dev
```

---

### 🔹 3. Setup Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🔐 API Endpoints

### Auth

* `POST /api/auth/signup`
* `POST /api/auth/login`

### Accounts

* `GET /api/accounts/balance`
* `GET /api/accounts/search`
* `GET /api/accounts/all`

### Transactions

* `POST /api/transactions/transfer`
* `GET /api/transactions`

### Notifications

* `GET /api/notifications`
* `GET /api/notifications/unread-count`
* `PUT /api/notifications/read-all`

### Admin

* `GET /api/admin`
* `DELETE /api/admin/user/:id`
* `DELETE /api/admin/transaction/:id`

---

## 🔑 Authentication

All protected routes require:

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🧪 Demo Flow

1. Signup → Account created with $1000
2. Login → Access dashboard
3. Transfer money → Updates balances
4. Receiver gets notification
5. Admin monitors system

---

## 🧠 Key Learnings

* JWT-based authentication
* Role-based access control
* REST API design
* MongoDB data modeling
* Full-stack integration
* Error handling & debugging
