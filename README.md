# Discord Bot Template

A clean, modular Discord bot template with a command class pattern and single source of truth for easy development and maintenance.

## ✨ **Key Features**

### **🎯 Single Source of Truth**
- **❌ No more updating commands in multiple files!**
- Add new commands in **ONE place**: `src/commands/index.ts`
- Automatically available in bot, registration, and help system
- Self-documenting with built-in help information

### **🏗️ Modular Command System**
- Each command is a self-contained class
- Built-in validation and error handling
- Automatic help generation from command metadata
- Contextual logging with Class:Function format

### **🔧 Developer Friendly**
- **TypeScript**: Full type safety and modern JavaScript features  
- **Minimal Setup**: Only essential dependencies
- **Easy Extension**: Add features by creating new classes
- **Clean Architecture**: Well-organized, maintainable codebase

## 🚀 Quick Start

### 1. Setup
```bash
# Clone or copy this template
npm install

# Copy environment file
cp .env.example .env
```

### 2. Configure
Edit `.env` file:
```env
# Required - Get from Discord Developer Portal
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_bot_client_id_here

# Optional - For developer-only commands
DEVELOPER_IDS=your_user_id_here,another_dev_id

# Optional - Environment (defaults to 'production')
NODE_ENV=development
```

**Environment validation** ensures all required variables are present and properly formatted before the bot starts.

### 3. Run
```bash
# Register commands with Discord
npm run register

# Start the bot
npm run dev
```

## 📁 Project Structure

```
src/
├── core/
│   ├── Bot.ts              # Main bot class with event handling
│   ├── Command.ts          # Abstract command base class
│   └── CommandManager.ts   # Centralized command management
├── commands/
│   ├── index.ts            # ← SINGLE SOURCE OF TRUTH
│   ├── PingCommand.ts      # Example: Basic ping command
│   ├── InfoCommand.ts      # Example: Bot info with embeds
│   ├── ExampleCommand.ts   # Example: Subcommands & options
│   ├── HelpCommand.ts      # Auto-generated help system
│   └── DevCommand.ts       # Developer-only debugging commands
├── services/
│   ├── Logger.ts           # Contextual logging service
│   ├── DiscordApi.ts       # Discord REST API helper
│   └── Environment.ts      # Environment validation service
├── index.ts                # Main entry point
└── register.ts             # Command registration script
```

## 🎯 Adding New Commands

### **Super Simple - Just ONE Step!**

**1. Create the command class:**
```typescript
// src/commands/MyCommand.ts
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command, CommandHelpInfo } from '../core/Command.js';

export class MyCommand extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName('mycommand')
    .setDescription('My awesome command')
    .addStringOption(option =>
      option.setName('input')
        .setDescription('Some input')
        .setRequired(true)
    );

  public readonly helpInfo: CommandHelpInfo = {
    name: 'mycommand',
    description: 'Detailed description of what this command does',
    usage: '/mycommand input:<text>',
    examples: ['/mycommand input:"Hello world"'],
    category: 'Custom'
  };

  // Optional: Set permissions and restrictions
  public readonly requiredPermissions: PermissionsString[] = ['SendMessages'];
  public readonly guildOnly = true;

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const input = interaction.options.getString('input', true);
    
    await interaction.reply({
      content: `You said: ${input}`,
      ephemeral: true
    });
  }
}
```

**2. Add to the command registry:**
```typescript
// src/commands/index.ts
import { MyCommand } from './MyCommand.js';

export const ALL_COMMANDS: Command[] = [
  new PingCommand(),
  new InfoCommand(),
  new ExampleCommand(),
  new HelpCommand(),
  new MyCommand(), // ← Add here - automatically available everywhere!
];
```

**3. Deploy:**
```bash
npm run deploy  # Builds, registers, and starts
```

**That's it!** Your command is now:
- ✅ Registered with Discord
- ✅ Available in the bot
- ✅ Listed in the help system
- ✅ Categorized automatically
- ✅ Searchable with autocomplete

## 📋 Built-in Commands

The template comes with several example commands to get you started:

### **Basic Commands**
- `/ping` - Simple ping/pong response with latency
- `/info` - Shows bot information and statistics with embeds
- `/help` - Auto-generated help system for all commands
- `/help <command>` - Detailed help for a specific command

### **Advanced Examples**
- `/example user @someone` - Demonstrates user options and validation
- `/example role @role` - Shows role handling and permissions
- `/example text "input"` - Text input with validation

### **Developer Tools** 
*(Only available to users listed in `DEVELOPER_IDS`)*
- `/dev info` - Shows environment info, process stats, and configuration
- `/dev test` - Runs performance tests and shows API latency

All commands demonstrate different aspects of Discord bot development and serve as templates for your own commands.

## 🔧 Advanced Command Examples

### Command with Options & Validation
```typescript
export class AdvancedCommand extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName('advanced')
    .setDescription('Advanced command with options')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('Some text input')
        .setRequired(true)
    )
    .addUserOption(option =>
      option.setName('user')
        .setDescription('A user to mention')
        .setRequired(false)
    );

  public readonly helpInfo: CommandHelpInfo = {
    name: 'advanced',
    description: 'Advanced command demonstrating options and user input',
    usage: '/advanced text:<input> [user:<@user>]',
    examples: [
      '/advanced text:"Hello world"',
      '/advanced text:"Hello" user:@john'
    ],
    category: 'Advanced'
  };

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const text = interaction.options.getString('text', true);
    const user = interaction.options.getUser('user');
    
    await interaction.reply({
      content: `You said: "${text}"${user ? ` about ${user}` : ''}`,
      ephemeral: true
    });
  }
}
```

### Command with Permissions & Restrictions
```typescript
export class ModeratorCommand extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName('moderate')
    .setDescription('Moderator-only command');

  public readonly helpInfo: CommandHelpInfo = {
    name: 'moderate',
    description: 'Moderator command for server management',
    usage: '/moderate',
    examples: ['/moderate'],
    category: 'Moderation'
  };

  // Configuration
  public readonly requiredPermissions: PermissionsString[] = ['ManageMessages', 'KickMembers'];
  public readonly guildOnly = true;

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    // This will only run if user has the required permissions
    await interaction.reply('Moderator command executed!');
  }
}
```

### Command with Subcommands
```typescript
export class ConfigCommand extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName('config')
    .setDescription('Configuration commands')
    .addSubcommand(subcommand =>
      subcommand
        .setName('view')
        .setDescription('View current configuration')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('set')
        .setDescription('Set a configuration value')
        .addStringOption(option =>
          option.setName('key')
            .setDescription('Configuration key')
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName('value')
            .setDescription('Configuration value')
            .setRequired(true)
        )
    );

  public readonly helpInfo: CommandHelpInfo = {
    name: 'config',
    description: 'Configuration commands for managing bot settings',
    usage: '/config <view|set> [key] [value]',
    examples: [
      '/config view',
      '/config set key:prefix value:!'
    ],
    category: 'Admin'
  };

  public readonly guildOnly = true;

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const subcommand = interaction.options.getSubcommand();
    
    switch (subcommand) {
      case 'view':
        await this.handleView(interaction);
        break;
      case 'set':
        await this.handleSet(interaction);
        break;
    }
  }

  private async handleView(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply('Current configuration: ...');
  }

  private async handleSet(interaction: ChatInputCommandInteraction): Promise<void> {
    const key = interaction.options.getString('key', true);
    const value = interaction.options.getString('value', true);
    
    await interaction.reply(`Set ${key} = ${value}`);
  }
}
```

## 🛠️ Services

### Logger with Context
```typescript
import { Logger } from '../services/Logger.js';

// Instance logger with context
const logger = new Logger({ context: 'MyCommand' });
logger.info('This will show [MyCommand] in logs');

// Static logger (no context)
Logger.info('This will show [INFO] in logs');
```

### Discord API Service
```typescript
import { DiscordApi } from '../services/DiscordApi.js';

// Make custom API calls
const guild = await DiscordApi.getGuild(guildId);
const role = await DiscordApi.createRole(guildId, { name: 'New Role' });
```

### Environment Service
```typescript
import { Environment } from '../services/Environment.js';

// Validate environment on startup (automatic in main files)
Environment.validate();

// Get validated configuration
const config = Environment.getConfig();
console.log(`Running in ${config.nodeEnv} mode`);
console.log(`Developer count: ${config.developerIds.length}`);
```

## 📋 Available Scripts

- `npm run build` - Compile TypeScript to JavaScript
- `npm run dev` - Build and run with file watching
- `npm run start` - Run the compiled bot
- `npm run register` - Register commands with Discord
- `npm run deploy` - Build, register, and start

## 🎯 System Benefits

### ✅ **Single Source of Truth**
- **ONE place** to add commands: `src/commands/index.ts`
- **Automatic registration** with Discord
- **Automatic help generation** from command metadata
- **No duplication** - add once, works everywhere

### ✅ **Self-Documenting Commands**
- Commands contain their own help information
- Automatic categorization and grouping
- Built-in usage examples and descriptions
- Searchable with autocomplete in `/help` command

### ✅ **One Command, One Class**
- All command logic in a single file
- Easy to find and modify specific commands
- Self-contained with its own validation and logic

### ✅ **Excellent Logging**
- Contextual logging: `[ClassName] functionName - message`
- Easy debugging with clear source identification
- Instance and static logger support

### ✅ **Type Safety**
- Full TypeScript support
- Compile-time error checking
- IntelliSense support for Discord.js

### ✅ **Built-in Features**
- Automatic error handling
- Permission validation
- Guild-only restrictions
- Developer-only commands

## 🔧 Customization & Extension

### Extending the Command Base Class
```typescript
// Add custom features to all commands
export abstract class CustomCommand extends Command {
  public readonly cooldown?: number;
  
  public async validate(interaction: ChatInputCommandInteraction): Promise<{ valid: boolean; reason?: string }> {
    const baseValidation = await super.validate(interaction);
    if (!baseValidation.valid) return baseValidation;
    
    // Add custom validation (cooldowns, etc.)
    if (this.cooldown) {
      // Implement cooldown logic
    }
    
    return { valid: true };
  }
}
```

### Adding New Services
```typescript
// src/services/Database.ts
export class Database {
  private static logger = new Logger({ context: 'Database' });
  
  public static async connect(): Promise<void> {
    this.logger.info('connect - Connecting to database...');
  }
  
  public static async query(sql: string): Promise<any> {
    this.logger.debug(`query - Executing: ${sql}`);
  }
}
```

## 🏆 **Why This Template is Perfect**

### **✅ Maintainable**
- Single source of truth eliminates duplication
- Clear logging shows exactly where issues occur
- Self-documenting commands reduce maintenance overhead

### **✅ Scalable**
- Modular command system grows with your bot
- Easy to add new features without breaking existing code
- Command class pattern supports complex functionality

### **✅ Developer Friendly**
- TypeScript provides excellent development experience
- Minimal boilerplate - focus on your bot's unique features
- Clear patterns for common Discord bot needs

### **✅ Production Ready**
- Built-in error handling and validation
- Proper logging for debugging and monitoring
- Clean architecture that's easy to understand and modify

## 🚀 **Getting Started**

1. **Copy this template** for your new bot project
2. **Update the environment variables** with your bot credentials
3. **Create your first command** using the examples above
4. **Add it to the command registry** in one place
5. **Deploy and enjoy** your new maintainable bot!

## 🤝 Usage

This template is designed to be copied and modified for your specific bot needs. It provides:

- **Solid foundation** without unnecessary complexity
- **Best practices** for Discord bot development
- **Extensible architecture** that grows with your needs
- **Excellent debugging** with contextual logging

Perfect for building everything from simple utility bots to complex community management systems!

## 📝 License

MIT License - Feel free to use this template for any purpose.

---

**Built with ❤️ for maintainable Discord bot development**