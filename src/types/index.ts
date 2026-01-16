export interface UserDocument {
  _id: string;              // CouchDB document ID (typically username or email)
  _rev?: string;            // CouchDB revision (auto-generated)
  username: string;         // Username for authentication
  passwordHash: string;     // Hashed password (using bcrypt or similar)
  serverUrl: string;        // The CouchDB server URL where user's data is stored
  domain: string;           // The CouchDB database name (domain) for the user
  createdAt: string;        // ISO 8601 timestamp of account creation
  updatedAt: string;        // ISO 8601 timestamp of last update
  active: boolean;          // Whether the account is active
}

export interface PreAuthenticateRequest {
  username: string;
  password: string;
}

export interface PreAuthenticateResponse {
  serverUrl: string;
  domain: string;
  username: string;
}

export interface ErrorResponse {
  error: string;
}

export interface MappingDocument {
  _id: string;              // CouchDB document ID (typically username)
  _rev?: string;            // CouchDB revision (auto-generated)
  username: string;         // Username
  serverUrl: string;       // The CouchDB server URL where user's data is stored
  domain: string;          // The CouchDB database name (domain) for the user
  lastLoginAt?: number;    // Timestamp of last login (Date.now())
}

export interface LaunchPromoSignupRequest {
  email: string;
  fullname: string;
}

export interface LaunchPromoSignupResponse {
  message: string;
  wasAlreadyRegistered: boolean;
}

export interface LaunchPromoSignupDocument {
  _id: string;              // CouchDB document ID (email)
  _rev?: string;            // CouchDB revision (auto-generated)
  $collection: 'launch-promo-signup';
  email: string;
  fullname: string;
  createdAt: string;        // ISO 8601 timestamp
}

export interface TelemetryPayload {
  username: string;
  currency: string | { name: string; sign: string };
  email?: string;
}

export interface TelemetryResponse {
  message: string;
}

export interface TelemetryDocument {
  _id: string;              // CouchDB document ID
  _rev?: string;            // CouchDB revision (auto-generated)
  $collection: 'telemetry';
  event: 'offline-onboarding';
  username: string;
  currency: string | { name: string; sign: string };
  email?: string;
  createdAt: string;        // ISO 8601 timestamp
}
