import dotenv from 'dotenv';
import { REST, Routes } from 'discord.js';
import { Logger } from './services/Logger.js';
import { Environment } from './services/Environment.js';
import { CommandManager } from './core/CommandManager.js';
import { ALL_COMMANDS } from './commands/index.js';

// Load environment variables
dotenv.config();

const logger = new Logger({ context: 'Register' });

/**
 * Register slash commands with Discord
 */
async function registerCommands() {
  try {
    // Validate environment variables
    Environment.validate();
    const config = Environment.getConfig();

    // Use centralized command manager
    const commandManager = new CommandManager(ALL_COMMANDS);
    const commandData = commandManager.getRegistrationData();

    logger.info(`registerCommands - Preparing to register ${commandData.length} commands`);

    // Create REST instance
    const rest = new REST().setToken(config.discordToken);

    logger.info(`registerCommands - Started refreshing ${commandData.length} application (/) commands`);

    // Register commands globally
    const data = await rest.put(
      Routes.applicationCommands(config.discordClientId),
      { body: commandData }
    ) as any[];

    logger.info(`registerCommands - Successfully reloaded ${data.length} application (/) commands`);

    // Log registered commands with their categories
    for (const command of ALL_COMMANDS) {
      const helpInfo = command.getHelpInfo();
      logger.info(`registerCommands - ✅ Registered: /${command.getName()} [${helpInfo.category}] - ${command.getDescription()}`);
    }

  } catch (error) {
    logger.error('registerCommands - Error registering commands:', error);
    process.exit(1);
  }
}

// Run command registration
registerCommands();
