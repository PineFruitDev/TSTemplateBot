# Discord Bot Template

A clean, modular Discord bot template with TypeScript, featuring a command class pattern and single source of truth architecture.

## Features

- **Single Source of Truth**: Add commands in one place, automatically available everywhere
- **TypeScript**: Full type safety and modern JavaScript features
- **Modular Commands**: Self-contained command classes with built-in validation
- **Environment Validation**: Comprehensive startup checks with helpful error messages
- **Auto-Generated Help**: Commands self-document with metadata
- **Contextual Logging**: Detailed logging with class and function context
- **Production Ready**: Error handling, validation, and clean architecture

## Quick Start

### 1. Setup
```bash
git clone <your-repo>
cd discord-bot-template
npm install
cp .env.example .env
```

### 2. Configure
Edit `.env` with your bot credentials:
```env
DISCORD_TOKEN=your_bot_token_here
DISCORD_CLIENT_ID=your_bot_client_id_here
DEVELOPER_IDS=your_user_id_here  # Optional
NODE_ENV=development             # Optional
```

### 3. Deploy
```bash
npm run register  # Register commands with Discord
npm run dev       # Start development server
```

## Project Structure

```
src/
├── core/
│   ├── Bot.ts              # Main bot class
│   ├── Command.ts          # Abstract command base
│   └── CommandManager.ts   # Command management
├── commands/
│   ├── index.ts            # ← Command registry (single source of truth)
│   ├── PingCommand.ts      # Basic example
│   ├── InfoCommand.ts      # Embed example
│   ├── ExampleCommand.ts   # Advanced features
│   ├── HelpCommand.ts      # Auto-generated help
│   └── DevCommand.ts       # Developer tools
├── services/
│   ├── Logger.ts           # Contextual logging
│   ├── DiscordApi.ts       # API helper
│   └── Environment.ts      # Config validation
├── index.ts                # Entry point
└── register.ts             # Command registration
```

## Adding Commands

### 1. Create Command Class
```typescript
// src/commands/MyCommand.ts
import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command, CommandHelpInfo } from '../core/Command.js';

export class MyCommand extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName('mycommand')
    .setDescription('My awesome command');

  public readonly helpInfo: CommandHelpInfo = {
    name: 'mycommand',
    description: 'Does something awesome',
    usage: '/mycommand',
    examples: ['/mycommand'],
    category: 'General'
  };

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply('Hello World!');
  }
}
```

### 2. Register Command
```typescript
// src/commands/index.ts
import { MyCommand } from './MyCommand.js';

export const ALL_COMMANDS: Command[] = [
  // ... existing commands
  new MyCommand(),  // ← Add here
];
```

**That's it!** Your command is automatically:
- ✅ Registered with Discord
- ✅ Available in the bot
- ✅ Listed in help system
- ✅ Validated and logged

## Built-in Commands

- `/ping` - Basic ping/pong with latency
- `/info` - Bot information and statistics
- `/help [command]` - Auto-generated help system
- `/example <subcommand>` - Advanced command examples
- `/dev <info|test>` - Developer tools (requires `DEVELOPER_IDS`)

## Scripts

- `npm run build` - Compile TypeScript
- `npm run dev` - Build and run with file watching
- `npm run start` - Start production server
- `npm run register` - Register commands with Discord
- `npm run deploy` - Build, register, and start

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DISCORD_TOKEN` | ✅ | Bot token from Discord Developer Portal |
| `DISCORD_CLIENT_ID` | ✅ | Bot client ID from Discord Developer Portal |
| `DEVELOPER_IDS` | ❌ | Comma-separated user IDs for developer commands |
| `NODE_ENV` | ❌ | Environment mode (defaults to `production`) |

## License

MIT License - See [LICENSE](LICENSE) file for details.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request