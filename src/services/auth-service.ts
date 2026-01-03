import axios, { AxiosError } from 'axios';
import { MappingRepository } from '../database/mapping-repository';
import { PreAuthenticateRequest, PreAuthenticateResponse } from '../types';
import { logger } from '../utils/logger';

export class AuthService {
  private mappingRepository = new MappingRepository();

  /**
   * Pre-authenticate a user by verifying credentials against remote CouchDB
   */
  async preAuthenticate(
    credentials: PreAuthenticateRequest
  ): Promise<PreAuthenticateResponse> {
    const { username, password } = credentials;

    // Use generic error message to prevent username enumeration
    const invalidCredentialsError = new Error('Invalid username or password.');

    // Step 1: Lookup in mapping database to get serverUrl and domain
    logger.debug('[AUTH-SERVICE] Looking up mapping for username:', username);
    const mapping = await this.mappingRepository.findByUsername(username);

    if (!mapping) {
      logger.debug('[AUTH-SERVICE] Mapping not found for username:', username);
      throw invalidCredentialsError;
    }

    logger.debug('[AUTH-SERVICE] Mapping found:', {
      username: mapping.username,
      serverUrl: mapping.serverUrl,
      domain: mapping.domain,
    });

    // Step 2: Pre-authenticate against remote CouchDB using user's credentials
    try {
      const validateUrl = `${mapping.serverUrl}/${mapping.domain}/_all_docs`;
      logger.debug('[AUTH-SERVICE] Attempting to authenticate against:', validateUrl);
      
      const validateResponse = await axios.get(validateUrl, {
        auth: {
          username,
          password,
        },
      });

      if (validateResponse.status !== 200) {
        logger.debug('[AUTH-SERVICE] Authentication failed - Invalid status:', validateResponse.status);
        throw invalidCredentialsError;
      }

      logger.debug('[AUTH-SERVICE] Authentication successful, updating lastLoginAt');
      // Step 3: Update lastLoginAt on successful pre-authentication
      await this.mappingRepository.updateLastLoginAt(username);

      // Step 4: Return server configuration
      return {
        serverUrl: mapping.serverUrl,
        domain: mapping.domain,
        username: mapping.username,
      };
    } catch (error) {
      if (error instanceof AxiosError) {
        logger.debug('[AUTH-SERVICE] Axios error:', {
          code: error.code,
          status: error.response?.status,
          message: error.message,
        });
        
        if (error.code === 'ERR_BAD_REQUEST' || error.response?.status === 401) {
          logger.debug('[AUTH-SERVICE] Authentication failed - Invalid credentials');
          throw invalidCredentialsError;
        }
        // Other axios errors
        logger.debug('[AUTH-SERVICE] Authentication failed - Unable to connect');
        const serverError = new Error('Unable to log in.');
        (serverError as any).statusCode = 500;
        throw serverError;
      }
      // Re-throw if it's already our custom error
      if (error === invalidCredentialsError) {
        throw error;
      }
      // Unexpected errors
      console.error('[AUTH-SERVICE] Unexpected pre-authentication error:', error);
      const serverError = new Error('Unable to log in.');
      (serverError as any).statusCode = 500;
      throw serverError;
    }
  }
}
