import { Logger } from './Logger.js';

/**
 * Environment validation service
 * Ensures all required environment variables are present and valid
 */
export class Environment {
  private static logger = new Logger({ context: 'Environment' });

  /**
   * Required environment variables for the bot to function
   */
  private static readonly REQUIRED_VARS = [
    'DISCORD_TOKEN',
    'DISCORD_CLIENT_ID'
  ] as const;

  /**
   * Optional environment variables with default values
   */
  private static readonly OPTIONAL_VARS = {
    NODE_ENV: 'production',
    DEVELOPER_IDS: ''
  } as const;

  /**
   * Validate all required environment variables
   * @throws Error if any required variables are missing or invalid
   */
  public static validate(): void {
    this.logger.info('validate - Validating environment variables...');

    const missing: string[] = [];
    const invalid: string[] = [];

    // Check required variables
    for (const varName of this.REQUIRED_VARS) {
      const value = process.env[varName];
      
      if (!value) {
        missing.push(varName);
        continue;
      }

      // Validate specific variables
      switch (varName) {
        case 'DISCORD_TOKEN':
          if (!this.isValidDiscordToken(value)) {
            invalid.push(`${varName} (invalid format)`);
          }
          break;
        
        case 'DISCORD_CLIENT_ID':
          if (!this.isValidDiscordId(value)) {
            invalid.push(`${varName} (invalid format)`);
          }
          break;
      }
    }

    // Check optional variables and set defaults
    for (const [varName, defaultValue] of Object.entries(this.OPTIONAL_VARS)) {
      if (!process.env[varName]) {
        process.env[varName] = defaultValue;
        this.logger.info(`validate - Set default for ${varName}: ${defaultValue}`);
      }
    }

    // Validate DEVELOPER_IDS format if provided
    if (process.env.DEVELOPER_IDS) {
      const devIds = process.env.DEVELOPER_IDS.split(',').map(id => id.trim());
      for (const id of devIds) {
        if (id && !this.isValidDiscordId(id)) {
          invalid.push(`DEVELOPER_IDS contains invalid ID: ${id}`);
        }
      }
    }

    // Report validation results
    if (missing.length > 0) {
      this.logger.error(`validate - Missing required environment variables: ${missing.join(', ')}`);
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    if (invalid.length > 0) {
      this.logger.error(`validate - Invalid environment variables: ${invalid.join(', ')}`);
      throw new Error(`Invalid environment variables: ${invalid.join(', ')}`);
    }

    this.logger.info('validate - Environment validation passed ✅');
    this.logEnvironmentInfo();
  }

  /**
   * Validate Discord token format
   */
  private static isValidDiscordToken(token: string): boolean {
    // Discord bot tokens follow the pattern: MTxxxxxxxxxxxxxxxxx.xxxxxx.xxxxxxxxxxxxxxxxxxxxxxxxxxx
    // or newer format with different structure
    return token.length > 50 && (token.includes('.') || token.startsWith('Bot '));
  }

  /**
   * Validate Discord ID format (snowflake)
   */
  private static isValidDiscordId(id: string): boolean {
    // Discord IDs are 17-20 digit snowflakes
    return /^\d{17,20}$/.test(id);
  }

  /**
   * Log environment information (without sensitive data)
   */
  private static logEnvironmentInfo(): void {
    this.logger.info(`validate - Environment: ${process.env.NODE_ENV}`);
    this.logger.info(`validate - Discord Client ID: ${process.env.DISCORD_CLIENT_ID}`);
    this.logger.info(`validate - Discord Token: ${this.maskToken(process.env.DISCORD_TOKEN!)}`);
    
    if (process.env.DEVELOPER_IDS) {
      const devCount = process.env.DEVELOPER_IDS.split(',').filter(id => id.trim()).length;
      this.logger.info(`validate - Developer IDs configured: ${devCount}`);
    }
  }

  /**
   * Mask sensitive token for logging
   */
  private static maskToken(token: string): string {
    if (token.length < 10) return '***';
    return token.substring(0, 6) + '***' + token.substring(token.length - 4);
  }

  /**
   * Get environment configuration object
   */
  public static getConfig() {
    return {
      discordToken: process.env.DISCORD_TOKEN!,
      discordClientId: process.env.DISCORD_CLIENT_ID!,
      nodeEnv: process.env.NODE_ENV!,
      developerIds: process.env.DEVELOPER_IDS?.split(',').map(id => id.trim()).filter(Boolean) || [],
      isDevelopment: process.env.NODE_ENV === 'development',
      isProduction: process.env.NODE_ENV === 'production'
    };
  }
}
