import { Logger } from './Logger.js';

/**
 * Discord API service for making REST calls
 * Useful for bots that need to make API calls outside of discord.js methods
 */
export class DiscordApi {
  private static readonly BASE_URL = 'https://discord.com/api/v10';
  private static logger = new Logger({ context: 'DiscordApi' });

  /**
   * Make a Discord API call
   * @param endpoint API endpoint (e.g., '/guilds/123/channels')
   * @param method HTTP method
   * @param body Request body
   * @param token Bot token
   */
  public static async call(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    body?: any,
    token?: string
  ): Promise<any> {
    this.logger.debug(`call - ${method} ${endpoint}`);
    const botToken = token || process.env.DISCORD_TOKEN;
    
    if (!botToken) {
      const errorMessage = 'Discord token not provided';
      this.logger.error(`call - ${errorMessage}`);
      throw new Error(errorMessage);
    }

    const url = `${this.BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      method,
      headers: {
        'Authorization': `Bot ${botToken}`,
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const errorText = await response.text();
      const errorMessage = `Discord API error: ${response.status} ${response.statusText} - ${errorText}`;
      this.logger.error(`call - ${errorMessage}`);
      throw new Error(errorMessage);
    }

    // Handle empty responses
    const responseText = await response.text();
    if (!responseText) {
      return {};
    }

    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      const errorMessage = `Invalid JSON response from Discord API: ${responseText}`;
      this.logger.error(`call - ${errorMessage}`, parseError);
      throw new Error(errorMessage);
    }
  }

  /**
   * Helper methods for common API calls
   */
  public static async getGuild(guildId: string): Promise<any> {
    this.logger.debug(`getGuild - Fetching guild ${guildId}`);
    return this.call(`/guilds/${guildId}`, 'GET');
  }

  public static async getChannel(channelId: string): Promise<any> {
    this.logger.debug(`getChannel - Fetching channel ${channelId}`);
    return this.call(`/channels/${channelId}`, 'GET');
  }

  public static async createRole(guildId: string, roleData: any): Promise<any> {
    this.logger.info(`createRole - Creating role "${roleData.name}" in guild ${guildId}`);
    return this.call(`/guilds/${guildId}/roles`, 'POST', roleData);
  }

  public static async createChannel(guildId: string, channelData: any): Promise<any> {
    this.logger.info(`createChannel - Creating channel "${channelData.name}" in guild ${guildId}`);
    return this.call(`/guilds/${guildId}/channels`, 'POST', channelData);
  }
}
