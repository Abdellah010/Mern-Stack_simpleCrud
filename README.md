# MERN CRUD — User Management App

A full MERN Stack app with JWT authentication and user CRUD operations, built on top of `crud-node-live`.

## Project Structure

```
mern-crud/
├── backend/
│   ├── server.js               # Express entry point
│   ├── .env.example            # Environment variables template
│   ├── models/User.js          # Mongoose User schema
│   ├── middleware/auth.js      # JWT protect middleware
│   └── routes/
│       ├── auth.js             # /api/auth — register, login, me
│       └── users.js            # /api/users — full CRUD
└── frontend/
│   ├── vite.config.js          # Vite + proxy to backend
│   └── src/
│       ├── App.jsx             # Router + PrivateRoute guard
│       ├── api/axios.js        # Axios with JWT interceptor
│       ├── pages/
│       │   ├── Login.jsx       # Login + Register page
│       │   └── Users.jsx       # Users list with CRUD
│       └── components/
│           └── UserModal.jsx   # Add/Edit user modal
└── MERN_CRUD.postman_collection.json
```

---

## Quick Start

### 1. Backend

```bash
cd backend
cp .env.example .env        # Edit MONGO_URI and JWT_SECRET
npm install
npm run dev                 # Starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev                 # Starts on http://localhost:5173
```

---

## API Endpoints

### Auth — `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/me` | Private | Get current user |

### Users — `/api/users`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users` | Private | Get all users |
| GET | `/api/users/:id` | Private | Get user by ID |
| POST | `/api/users` | Private | Create a user |
| PUT | `/api/users/:id` | Private | Update a user |
| DELETE | `/api/users/:id` | Private | Delete a user |

> **All `/api/users` routes require `Authorization: Bearer <token>` header.**

---

## Testing with Postman

1. Import `MERN_CRUD.postman_collection.json` into Postman
2. Call **Register** or **Login** — the token is **auto-saved** to collection variables
3. All other requests automatically use the saved token via `{{token}}`
4. After "Get All Users", copy a `_id` and set it as `{{userId}}` in collection variables

---

## Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern_crud
JWT_SECRET=your_super_secret_key_change_this
```

---

## User Model

```js
{
  name:      String  (required)
  email:     String  (required, unique)
  password:  String  (required, hashed with bcrypt)
  role:      "user" | "admin"  (default: "user")
  createdAt: Date
  updatedAt: Date
}
```

**Password is never returned in API responses** — it's stripped by `toJSON()`.