import { Command } from './Command.js';
import { Logger } from '../services/Logger.js';

/**
 * CommandManager handles all command operations from a single source of truth
 */
export class CommandManager {
  private logger = new Logger({ context: 'CommandManager' });
  private commands: Command[] = [];
  private commandMap: Map<string, Command> = new Map();

  constructor(commands: Command[]) {
    this.commands = commands;
    this.loadCommands();
  }

  /**
   * Load all commands into the command map
   */
  private loadCommands(): void {
    this.logger.info('loadCommands - Loading commands...');
    
    for (const command of this.commands) {
      this.commandMap.set(command.getName(), command);
      this.logger.info(`loadCommands - Loaded: ${command.getName()}`);
    }
    
    this.logger.info(`loadCommands - Loaded ${this.commands.length} commands total`);
  }

  /**
   * Get all commands
   */
  public getAllCommands(): Command[] {
    return this.commands;
  }

  /**
   * Get command by name
   */
  public getCommand(name: string): Command | undefined {
    return this.commandMap.get(name);
  }

  /**
   * Get all command registration data for Discord
   */
  public getRegistrationData(): any[] {
    this.logger.info('getRegistrationData - Preparing command registration data');
    return this.commands.map(command => {
      this.logger.debug(`getRegistrationData - Processing: ${command.getName()}`);
      return command.getRegistrationData();
    });
  }

  /**
   * Get commands grouped by category for help system
   */
  public getCommandsByCategory(): Map<string, Command[]> {
    const categories = new Map<string, Command[]>();
    
    for (const command of this.commands) {
      const category = command.getHelpInfo().category;
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(command);
    }
    
    return categories;
  }

  /**
   * Get command help information
   */
  public getCommandHelp(commandName?: string): any {
    if (commandName) {
      const command = this.getCommand(commandName);
      return command ? command.getHelpInfo() : null;
    }
    
    // Return all commands grouped by category
    const categories = this.getCommandsByCategory();
    const helpData: any = {};
    
    for (const [category, commands] of categories) {
      helpData[category] = commands.map(cmd => ({
        name: cmd.getName(),
        description: cmd.getDescription(),
        usage: cmd.getHelpInfo().usage
      }));
    }
    
    return helpData;
  }

  /**
   * Get total command count
   */
  public getCommandCount(): number {
    return this.commands.length;
  }
}
