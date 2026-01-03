import { createApp } from './app';
import { env } from './config/env';
import { initializeMappingDatabase } from './database/couchdb';

async function startServer(): Promise<void> {
  try {
    // Initialize mapping database
    console.log('Initializing mapping database...');
    await initializeMappingDatabase();
    console.log('Mapping database initialized successfully');

    // Create Express app
    const app = createApp();

    // Start server
    const port = env.server.port;
    app.listen(port, () => {
      console.log(`Authentication server running on port ${port}`);
      console.log(`Environment: ${env.server.nodeEnv}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
