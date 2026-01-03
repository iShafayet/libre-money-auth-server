/**
 * Logger abstraction for console logging
 */
class Logger {
  /**
   * Log debug messages
   */
  debug(...args: any[]): void {
    console.debug(...args);
  }
}

// Export singleton instance
export const logger = new Logger();
