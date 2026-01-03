# Libre Money Authentication Server

A centralized pre-authentication service that maps user credentials to their corresponding CouchDB server URL and domain. This service validates user credentials against remote CouchDB servers and returns the appropriate server configuration for client applications.

## Features

- Pre-authentication via username/password against remote CouchDB servers
- User-to-server mapping stored in a centralized CouchDB database
- Rate limiting to prevent brute force attacks (5 attempts per IP per 15 minutes)
- Generic error messages to prevent username enumeration
- Input validation and sanitization (username trimming, type checking)
- CORS support with configurable origins
- Credentials validated against remote CouchDB servers (no password storage)
- Comprehensive error handling with appropriate HTTP status codes
- Health check endpoint
- TypeScript for type safety
- Comprehensive logging for debugging
- Automatic mapping database initialization

## Prerequisites

- Node.js (v18 or higher)
- CouchDB server running and accessible
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your configuration (see Configuration section below).

## Configuration

Edit `.env` file with your settings:

```env
COUCHDB_URL=http://localhost:5984
COUCHDB_MASTER_ADMIN_USERNAME=admin
COUCHDB_MASTER_ADMIN_PASSWORD=password
COUCHDB_MAPPING_DATABASE_NAME=user_mappings
PORT=3000
NODE_ENV=production
CORS_ORIGIN=*
```

**Required Environment Variables:**
- `COUCHDB_URL`: The URL of your CouchDB server
- `COUCHDB_MASTER_ADMIN_USERNAME`: Master admin username for CouchDB
- `COUCHDB_MASTER_ADMIN_PASSWORD`: Master admin password for CouchDB
- `COUCHDB_MAPPING_DATABASE_NAME`: Name of the database that stores user-to-server mappings
- `PORT`: Port number for the server (default: 3000)
- `NODE_ENV`: Environment mode (development/production)
- `CORS_ORIGIN`: CORS origin (use `*` for all origins)

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

### POST `/pre-authenticate`

Pre-authenticates a user by validating credentials against their remote CouchDB server and returns their server configuration.

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
- `401 Unauthorized`: Invalid credentials (username or password incorrect)
- `429 Too Many Requests`: Rate limit exceeded (5 attempts per 15 minutes)
- `500 Internal Server Error`: Server error or unable to connect to remote CouchDB

**Authentication Flow:**
1. Lookup user mapping in the centralized database to get `serverUrl` and `domain`
2. Validate credentials against the remote CouchDB server using the user's credentials
3. Update `lastLoginAt` timestamp on successful authentication
4. Return server configuration to the client

### GET `/health`

Health check endpoint for monitoring.

**Response (200):**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Testing

Run tests:
```bash
npm test
```

## License

ISC
