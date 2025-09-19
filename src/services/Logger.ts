/**
 * Simple logging service with optional context support
 */
export class Logger {
  private context?: string;
  
  constructor(options?: { context?: string }) {
    this.context = options?.context;
  }

  private static formatTimestamp(): string {
    return new Date().toISOString();
  }

  // Instance methods (with context)
  public info(message: string, ...args: any[]): void {
    const contextTag = this.context ? `[${this.context}]` : '[INFO]';
    console.log(`[${Logger.formatTimestamp()}] ${contextTag} ${message}`, ...args);
  }

  public warn(message: string, ...args: any[]): void {
    const contextTag = this.context ? `[${this.context}]` : '[WARN]';
    console.warn(`[${Logger.formatTimestamp()}] ${contextTag} ${message}`, ...args);
  }

  public error(message: string, error?: any): void {
    const contextTag = this.context ? `[${this.context}]` : '[ERROR]';
    console.error(`[${Logger.formatTimestamp()}] ${contextTag} ${message}`);
    if (error) {
      console.error(error);
    }
  }

  public debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      const contextTag = this.context ? `[${this.context}]` : '[DEBUG]';
      console.debug(`[${Logger.formatTimestamp()}] ${contextTag} ${message}`, ...args);
    }
  }

  // Static methods (without context - for backwards compatibility)
  public static info(message: string, ...args: any[]): void {
    console.log(`[${this.formatTimestamp()}] [INFO] ${message}`, ...args);
  }

  public static warn(message: string, ...args: any[]): void {
    console.warn(`[${this.formatTimestamp()}] [WARN] ${message}`, ...args);
  }

  public static error(message: string, error?: any): void {
    console.error(`[${this.formatTimestamp()}] [ERROR] ${message}`);
    if (error) {
      console.error(error);
    }
  }

  public static debug(message: string, ...args: any[]): void {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[${this.formatTimestamp()}] [DEBUG] ${message}`, ...args);
    }
  }
}
