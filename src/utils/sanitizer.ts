/**
 * Sanitization utilities for user input
 */

/**
 * CouchDB document ID restrictions:
 * - Cannot contain: /, ?, #, &
 * - Should not start with underscore (reserved for system docs)
 * - Maximum length: 1024 bytes (but we'll use a more reasonable limit)
 * - Should be URL-safe
 */
const INVALID_DOC_ID_CHARS = /[\/?#&]/g;
const MAX_DOC_ID_LENGTH = 200; // Reasonable limit for document IDs

/**
 * Control characters and other potentially problematic characters
 * Includes: null, newline, carriage return, tab, and other control chars
 */
const CONTROL_CHARS = /[\x00-\x1F\x7F-\x9F]/g;

/**
 * Sanitize a string for use in CouchDB document ID
 * Removes invalid characters and enforces length limits
 */
export function sanitizeDocumentId(input: string): string {
  if (!input || typeof input !== 'string') {
    throw new Error('Document ID input must be a non-empty string');
  }

  // Remove invalid characters for CouchDB document IDs
  let sanitized = input.replace(INVALID_DOC_ID_CHARS, '-');
  
  // Remove leading/trailing whitespace and dots (CouchDB doesn't like leading dots)
  sanitized = sanitized.trim().replace(/^\.+|\.+$/g, '');
  
  // Remove control characters
  sanitized = sanitized.replace(CONTROL_CHARS, '');
  
  // Enforce length limit
  if (sanitized.length > MAX_DOC_ID_LENGTH) {
    sanitized = sanitized.substring(0, MAX_DOC_ID_LENGTH);
  }
  
  // Ensure it's not empty after sanitization
  if (sanitized.length === 0) {
    throw new Error('Document ID cannot be empty after sanitization');
  }
  
  return sanitized;
}

/**
 * Sanitize a string for storage in CouchDB
 * Removes control characters and enforces reasonable length limits
 */
export function sanitizeString(input: string, maxLength: number = 1000): string {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Remove control characters (but preserve newlines/tabs if needed for specific fields)
  let sanitized = input.replace(CONTROL_CHARS, '');
  
  // Enforce length limit
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Sanitize email for use in document ID
 * More permissive than general document ID sanitization (preserves @ and .)
 */
export function sanitizeEmailForDocId(email: string): string {
  if (!email || typeof email !== 'string') {
    throw new Error('Email must be a non-empty string');
  }

  // Remove invalid characters but preserve @ and . for email format
  let sanitized = email.replace(/[\/?#&]/g, '-');
  
  // Remove control characters
  sanitized = sanitized.replace(CONTROL_CHARS, '');
  
  // Remove leading/trailing whitespace and dots
  sanitized = sanitized.trim().replace(/^\.+|\.+$/g, '');
  
  // Enforce length limit
  if (sanitized.length > MAX_DOC_ID_LENGTH) {
    sanitized = sanitized.substring(0, MAX_DOC_ID_LENGTH);
  }
  
  if (sanitized.length === 0) {
    throw new Error('Email cannot be empty after sanitization');
  }
  
  return sanitized;
}

/**
 * Sanitize username for use in document ID
 */
export function sanitizeUsernameForDocId(username: string): string {
  return sanitizeDocumentId(username);
}

/**
 * Validate and sanitize fullname
 * Allows more characters than document IDs (spaces, hyphens, apostrophes, etc.)
 */
export function sanitizeFullname(fullname: string, maxLength: number = 200): string {
  if (!fullname || typeof fullname !== 'string') {
    return '';
  }

  // Remove control characters
  let sanitized = fullname.replace(CONTROL_CHARS, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Enforce length limit
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}

/**
 * Sanitize currency string
 */
export function sanitizeCurrencyString(currency: string, maxLength: number = 50): string {
  if (!currency || typeof currency !== 'string') {
    return '';
  }

  // Remove control characters
  let sanitized = currency.replace(CONTROL_CHARS, '');
  
  // Trim whitespace
  sanitized = sanitized.trim();
  
  // Enforce length limit
  if (sanitized.length > maxLength) {
    sanitized = sanitized.substring(0, maxLength);
  }
  
  return sanitized;
}
