import nano, { ServerScope, DocumentScope } from 'nano';
import { env } from '../config/env';

let couchdbInstance: ServerScope | null = null;
let mappingDatabaseInstance: DocumentScope<any> | null = null;

/**
 * Get CouchDB server instance
 */
export function getCouchDB(): ServerScope {
  if (!couchdbInstance) {
    const couchdbUrl = new URL(env.couchdb.url);
    couchdbUrl.username = env.couchdb.masterAdminUsername;
    couchdbUrl.password = env.couchdb.masterAdminPassword;

    couchdbInstance = nano(couchdbUrl.toString());
  }
  return couchdbInstance;
}

/**
 * Get the mapping database instance
 */
export function getMappingDatabase(): DocumentScope<any> {
  if (!mappingDatabaseInstance) {
    const couchdb = getCouchDB();
    mappingDatabaseInstance = couchdb.db.use(env.couchdb.mappingDatabaseName);
  }
  return mappingDatabaseInstance;
}

/**
 * Initialize the mapping database - create if it doesn't exist
 */
export async function initializeMappingDatabase(): Promise<void> {
  const couchdb = getCouchDB();
  const mappingDbName = env.couchdb.mappingDatabaseName;

  try {
    // Check if database exists
    await couchdb.db.get(mappingDbName);
    console.log(`Mapping database ${mappingDbName} already exists`);
  } catch (error: any) {
    // Database doesn't exist, create it
    if (error.statusCode === 404) {
      await couchdb.db.create(mappingDbName);
      console.log(`Mapping database ${mappingDbName} created`);
    } else {
      throw error;
    }
  }
}
