import dotenv from 'dotenv';
import { Bot } from './core/Bot.js';
import { Logger } from './services/Logger.js';
import { Environment } from './services/Environment.js';
import { ALL_COMMANDS } from './commands/index.js';

const logger = new Logger({ context: 'Main Index' });

// Load environment variables
dotenv.config();

/**
 * Main entry point for the Discord bot
 */
async function main() {
  try {
     // Validate environment variables
     Environment.validate();
     const config = Environment.getConfig();

     logger.info(`Initializing bot with ${ALL_COMMANDS.length} commands`);

     // Create and start bot using centralized command registry
     const bot = new Bot(config.discordToken, ALL_COMMANDS);
    
     // Graceful shutdown handling
     process.on('SIGINT', async () => {
       logger.info('Received SIGINT, shutting down gracefully...');
       await bot.stop();
       process.exit(0);
     });

     process.on('SIGTERM', async () => {
       logger.info('Received SIGTERM, shutting down gracefully...');
       await bot.stop();
       process.exit(0);
     });

     // Start the bot
     await bot.start();
     logger.info('Bot started successfully!');

   } catch (error) {
     logger.error('Failed to start bot:', error);
     process.exit(1);
   }
}

// Run the bot
main();
