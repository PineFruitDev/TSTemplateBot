import { Command } from '../core/Command.js';
import { PingCommand } from './PingCommand.js';
import { InfoCommand } from './InfoCommand.js';
import { ExampleCommand } from './ExampleCommand.js';
import { HelpCommand } from './HelpCommand.js';
import { DevCommand } from './DevCommand.js';

/**
 * Central command registry - SINGLE SOURCE OF TRUTH
 * Add new commands here and they'll automatically be available everywhere
 */
export const ALL_COMMANDS: Command[] = [
  new PingCommand(),
  new InfoCommand(),
  new ExampleCommand(),
  new HelpCommand(),
  new DevCommand(),
  // Add new commands here - they'll automatically be registered and available
];

/**
 * Export individual commands for type checking if needed
 */
export { PingCommand } from './PingCommand.js';
export { InfoCommand } from './InfoCommand.js';
export { ExampleCommand } from './ExampleCommand.js';
export { HelpCommand } from './HelpCommand.js';
export { DevCommand } from './DevCommand.js';
