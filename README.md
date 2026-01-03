# Libre Money Authentication Server

A centralized authentication service that maps user credentials to their corresponding CouchDB server URL and domain.

## Features

- User authentication via username/password
- CouchDB integration for user data storage
- Rate limiting (5 attempts per IP per 15 minutes)
- Secure password hashing with bcrypt
- CORS support
- Health check endpoint
- TypeScript for type safety

## Prerequisites

- Node.js (v18 or higher)
- CouchDB server running and accessible
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Copy the example environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your CouchDB credentials and server configuration.

4. Initialize the database:
```bash
npm run setup
```

## Configuration

Edit `.env` file with your settings:

```env
COUCHDB_URL=http://localhost:5984
COUCHDB_MASTER_ADMIN_USERNAME=admin
COUCHDB_MASTER_ADMIN_PASSWORD=password
PORT=3000
NODE_ENV=production
CORS_ORIGIN=*
```

## Running the Server

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

## API Endpoints

### POST `/authenticate`

Authenticates a user and returns their server configuration.

**Request:**
```json
{
  "username": "user@example.com",
  "password": "userPassword123"
}
```

**Success Response (200):**
```json
{
  "serverUrl": "https://cluster-1.libre.money",
  "domain": "userdomain",
  "username": "user@example.com"
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request body or missing fields
- `401 Unauthorized`: Invalid credentials
- `403 Forbidden`: Account is inactive
- `500 Internal Server Error`: Server error

### GET `/health`

Health check endpoint for monitoring.

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Project Structure

```
.local/
├── src/
│   ├── config/
│   │   └── env.ts              # Environment variable validation
│   ├── database/
│   │   ├── couchdb.ts          # CouchDB connection and setup
│   │   ├── user-repository.ts  # User data access layer
│   │   └── setup.ts            # Database setup script
│   ├── middleware/
│   │   ├── rate-limiter.ts     # Rate limiting middleware
│   │   ├── error-handler.ts    # Error handling middleware
│   │   └── validator.ts        # Request validation middleware
│   ├── routes/
│   │   └── auth.ts             # Authentication routes
│   ├── services/
│   │   ├── auth-service.ts     # Authentication logic
│   │   └── password-service.ts # Password hashing/verification
│   ├── types/
│   │   └── index.ts            # TypeScript type definitions
│   ├── app.ts                  # Express app setup
│   └── server.ts               # Server entry point
├── .env.example                # Example environment variables
├── package.json
├── tsconfig.json
└── README.md
```

## Security Features

- Password hashing with bcrypt (10 salt rounds)
- Rate limiting to prevent brute force attacks
- Generic error messages to prevent username enumeration
- Input validation and sanitization
- CORS configuration
- No sensitive data in logs

## Testing

Run tests:
```bash
npm test
```

## License

ISC
