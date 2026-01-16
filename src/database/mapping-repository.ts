import { getMappingDatabase } from './couchdb';
import { MappingDocument, LaunchPromoSignupDocument } from '../types';

export class MappingRepository {
  private db = getMappingDatabase();

  /**
   * Find a mapping document by username
   */
  async findByUsername(username: string): Promise<MappingDocument | null> {
    try {
      const doc = await this.db.get(username) as any;
      return doc as MappingDocument;
    } catch (error: any) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Update the lastLoginAt timestamp for a user
   */
  async updateLastLoginAt(username: string): Promise<void> {
    try {
      const existing = await this.db.get(username) as any;
      const updated: MappingDocument = {
        ...existing,
        lastLoginAt: Date.now(),
      };
      await this.db.insert(updated);
    } catch (error: any) {
      if (error.statusCode === 404) {
        throw new Error(`Mapping document not found for username: ${username}`);
      }
      throw error;
    }
  }

  /**
   * Create a new mapping document
   */
  async create(mapping: Omit<MappingDocument, '_rev'>): Promise<MappingDocument> {
    const result = await this.db.insert(mapping);
    return {
      ...mapping,
      _rev: result.rev,
    };
  }

  /**
   * Update an existing mapping document
   */
  async update(mapping: MappingDocument): Promise<MappingDocument> {
    const result = await this.db.insert(mapping);
    return {
      ...mapping,
      _rev: result.rev,
    };
  }

  /**
   * Register a launch promo signup
   * Returns true if already registered, false if newly registered
   */
  async registerLaunchPromoSignup(
    email: string,
    fullname: string
  ): Promise<boolean> {
    try {
      // Use email as document ID for easy lookup
      const docId = `launch-promo-signup:${email}`;
      
      // Check if document already exists
      try {
        const existing = await this.db.get(docId) as any;
        if (existing && existing.$collection === 'launch-promo-signup') {
          return true; // Already registered
        }
      } catch (error: any) {
        if (error.statusCode !== 404) {
          throw error;
        }
        // Document doesn't exist, continue to create
      }

      // Create new document
      const newDoc: Omit<LaunchPromoSignupDocument, '_rev'> = {
        _id: docId,
        $collection: 'launch-promo-signup',
        email,
        fullname,
        createdAt: new Date().toISOString(),
      };

      await this.db.insert(newDoc);
      return false; // Newly registered
    } catch (error: any) {
      // If error is due to document conflict (already exists), return true
      if (error.statusCode === 409) {
        return true;
      }
      throw error;
    }
  }
}
