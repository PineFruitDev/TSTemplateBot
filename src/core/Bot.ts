import { Client, GatewayIntentBits, Events, Interaction } from 'discord.js';
import { Command } from './Command.js';
import { CommandManager } from './CommandManager.js';
import { Logger } from '../services/Logger.js';

/**
 * Main Bot class that handles Discord client and command management
 */
export class Bot {
  private logger = new Logger({ context: 'Bot' });
  private client: Client;
  private commandManager: CommandManager;

  constructor(
    private token: string,
    commands: Command[] = [],
    intents: GatewayIntentBits[] = [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent
    ]
  ) {
    this.client = new Client({ intents });
    this.commandManager = new CommandManager(commands);
    this.setupEventListeners();
  }

  /**
   * Set up Discord event listeners
   */
  private setupEventListeners(): void {
    this.client.once(Events.ClientReady, () => {
       this.logger.info(`setupEventListeners - Bot logged in as ${this.client.user?.tag}`);
    });

    this.client.on(Events.InteractionCreate, async (interaction: Interaction) => {
      if (!interaction.isChatInputCommand()) return;

      const command = this.commandManager.getCommand(interaction.commandName);
      if (!command) {
         this.logger.warn(`setupEventListeners - Unknown command: ${interaction.commandName}`);
        return;
      }

      try {
        // Validate command
        const validation = await command.validate(interaction);
        if (!validation.valid) {
          this.logger.warn(`setupEventListeners - Command validation failed for ${interaction.commandName}: ${validation.reason}`);
          await interaction.reply({
            content: `❌ ${validation.reason}`,
            ephemeral: true
          });
          return;
        }

        // Execute command
        await command.execute(interaction, process.env);
         this.logger.info(`setupEventListeners - Executed command: ${interaction.commandName} by ${interaction.user.tag}`);

      } catch (error) {
         this.logger.error(`setupEventListeners - Error executing command ${interaction.commandName}:`, error);
        
        const errorMessage = '❌ An error occurred while executing this command.';
        
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({ content: errorMessage, ephemeral: true });
        } else {
          await interaction.reply({ content: errorMessage, ephemeral: true });
        }
      }
    });

    this.client.on(Events.Error, (error) => {
       this.logger.error('setupEventListeners - Discord client error:', error);
    });
  }

  /**
   * Start the bot
   */
  public async start(): Promise<void> {
    try {
      await this.client.login(this.token);
    } catch (error) {
       this.logger.error('start - Failed to start bot:', error);
      throw error;
    }
  }

  /**
   * Stop the bot
   */
  public async stop(): Promise<void> {
     this.logger.info('Bot:stop - Shutting down bot...');
    await this.client.destroy();
  }

  /**
   * Get the command manager
   */
  public getCommandManager(): CommandManager {
    return this.commandManager;
  }

  /**
   * Get the Discord client instance
   */
  public getClient(): Client {
    return this.client;
  }
}
