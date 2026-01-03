import { getMappingDatabase } from './couchdb';
import { MappingDocument } from '../types';

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
}
