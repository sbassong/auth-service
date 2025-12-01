# Authentication Microservice

A simple, dedicated microservice for handling user registration and authentication. This service connects to a MongoDB database to store user credentials securely and issues JSON Web Tokens (JWT) for session management.

This service is intended to be used by other authorizzed programs that require a centralized login and signup solution.

## Communication Contract

This service provides two primary endpoints: one for creating new users and one for logging in.

---

### 1. User Registration (Signup)

Creates a new user account. The service handles hashing the password before storage.

#### How to REQUEST Data

You must send user details to the `/signup` endpoint using the `POST` method and `application/json` content type.

- **Endpoint:** `POST /auth/signup`
- **Method:** `POST`
- **Body Type:** `application/json`
- **Required Fields:** `username`, `email` (must be unique), `password`.

#### Example Call (JavaScript `fetch`)

```javascript
const userData = {
  username: "NewUser123",
  email: "user@example.com",
  password: "securePassword!"
};

const serviceUrl = "http://localhost:3001/auth/signup";

try {
  const response = await fetch(serviceUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(userData)
  });

  const responseData = await response.json();

  if (response.ok) {
    console.log("Signup successful:", responseData);
  } else {
    console.error("Signup failed:", responseData.msg);
  }
} catch (error) {
  console.error("Network error:", error.message);
}
```

#### How to RECEIVE Data

**On Success (HTTP Status `200 OK`)**

The service returns the created user object (excluding the password digest).

```json
{
  "username": "NewUser123",
  "email": "user@example.com",
  "passwordDigest": "$2b$12$...", 
  "_id": "64f...",
  "createdAt": "2023-10-27T10:00:00.000Z",
  "updatedAt": "2023-10-27T10:00:00.000Z"
}
```

**On Error (HTTP Status `400 Bad Request`)**

If the email already exists in the database.

```json
{
  "status": "Error",
  "msg": "Email already exists!"
}
```

---

### 2. User Login (Signin)

Verifies credentials and returns a signed JWT for use in authenticated requests.

#### How to REQUEST Data

You must send credentials to the `/auth/signin` endpoint using the `POST` method and `application/json` content type.

- **Endpoint:** `POST /auth/signin`
- **Method:** `POST`
- **Body Type:** `application/json`
- **Required Fields:** `email`, `password`.

#### Example Call (JavaScript `fetch`)

```javascript
const credentials = {
  email: "user@example.com",
  password: "securePassword!"
};

const serviceUrl = "http://localhost:3001/auth/signin";

try {
  const response = await fetch(serviceUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials)
  });

  const responseData = await response.json();

  if (response.ok) {
    // Store this token for future authorized requests
    console.log("Login successful. Token:", responseData.token);
  } else {
    console.error("Login failed:", responseData.msg);
  }
} catch (error) {
  console.error("Network error:", error.message);
}
```

#### How to RECEIVE Data

**On Success (HTTP Status `200 OK`)**

The service returns a payload containing user details and the JWT string.

```json
{
  "user": {
    "id": "64f...",
    "email": "user@example.com",
    "username": "NewUser123"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**On Error (HTTP Status `401 Unauthorized`)**

If the email is not found or the password does not match.

```json
{
  "status": "Error",
  "msg": "Unauthorized"
}
```

---

## Getting Started: Running the Service Locally

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Set up environment:**
    Create a `.env` file in the root and populate it with your database connection and security secrets.

    ```.env
    # make sure password is URL Encoded if it has special characters
    MONGODB_URI=mongodb+srv://yourUser:yourPassword@cluster0.mongodb.net/authDatabase

    # Auth Configuration
    APP_SECRET=YourSuperSecretKeyHere
    SALT_ROUNDS=12
    ```

3.  **Start the server:**
    ```bash
    npm start
    ```
    The service will be running on `http://localhost:3001`.