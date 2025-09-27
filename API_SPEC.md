# API Specification

## 1. Authentication
### `POST /api/auth/register`
- **Description:** Register a new user.
- **Request Body:** `{ "name": "string", "email": "string", "password": "string" }`
- **Response:**
  - `201 OK`: `{ "message": "User registered successfully", "user": { ... } }`
  - `400 Bad Request`: `{ "message": "Email, password, and name are required" }`
  - `409 Conflict`: `{ "message": "User with this email already exists" }`

### `POST /api/auth/login`
- **Description:** Log in a user and get a JWT token.
- **Request Body:** `{ "email": "string", "password": "string" }`
- **Response:**
  - `200 OK`: `{ "token": "string", "user": { ... } }`
  - `401 Unauthorized`: `{ "message": "Invalid credentials" }`
... (lanjutkan untuk semua endpoint lainnya)