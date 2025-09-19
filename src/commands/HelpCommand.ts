import { 
  ChatInputCommandInteraction, 
  SlashCommandBuilder, 
  EmbedBuilder 
} from 'discord.js';
import { Command, CommandHelpInfo } from '../core/Command.js';
import { ALL_COMMANDS } from './index.js';

/**
 * Help command that automatically uses all registered commands
 * Demonstrates how the centralized system makes help generation automatic
 */
export class HelpCommand extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName('help')
    .setDescription('Get help with bot commands')
    .addStringOption(option =>
      option.setName('command')
        .setDescription('Get detailed help for a specific command')
        .setRequired(false)
        .setAutocomplete(true)
    );

  public readonly helpInfo: CommandHelpInfo = {
    name: 'help',
    description: 'Get help with bot commands and see detailed usage instructions',
    usage: '/help [command]',
    examples: ['/help', '/help command:ping', '/help command:info'],
    category: 'Utility'
  };

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const specificCommand = interaction.options.getString('command');

    if (specificCommand) {
      await this.showSpecificCommandHelp(interaction, specificCommand);
    } else {
      await this.showAllCommandsHelp(interaction);
    }
  }

  private async showSpecificCommandHelp(interaction: ChatInputCommandInteraction, commandName: string): Promise<void> {
    const command = ALL_COMMANDS.find(cmd => cmd.getName() === commandName);
    
    if (!command) {
      await interaction.reply({
        content: `❌ Command "${commandName}" not found.`,
        ephemeral: true
      });
      return;
    }

    const helpInfo = command.getHelpInfo();
    
    const embed = new EmbedBuilder()
      .setTitle(`📖 Help: /${helpInfo.name}`)
      .setDescription(helpInfo.description)
      .setColor(0x00AE86)
      .addFields(
        {
          name: '📋 Usage',
          value: `\`${helpInfo.usage}\``,
          inline: false
        },
        {
          name: '🎯 Examples',
          value: helpInfo.examples.map(ex => `\`${ex}\``).join('\n'),
          inline: false
        },
        {
          name: '📂 Category',
          value: helpInfo.category,
          inline: true
        }
      )
      .setTimestamp();

    // Add permission info if any
    if (command.requiredPermissions.length > 0) {
      embed.addFields({
        name: '🔒 Required Permissions',
        value: command.requiredPermissions.join(', '),
        inline: true
      });
    }

    // Add restrictions if any
    const restrictions: string[] = [];
    if (command.guildOnly) restrictions.push('Server only');
    if (command.developerOnly) restrictions.push('Developer only');
    
    if (restrictions.length > 0) {
      embed.addFields({
        name: '⚠️ Restrictions',
        value: restrictions.join(', '),
        inline: true
      });
    }

    await interaction.reply({ embeds: [embed] });
  }

  private async showAllCommandsHelp(interaction: ChatInputCommandInteraction): Promise<void> {
    // Group commands by category
    const categories = new Map<string, Command[]>();
    
    for (const command of ALL_COMMANDS) {
      const category = command.getHelpInfo().category;
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(command);
    }

    const embed = new EmbedBuilder()
      .setTitle('🤖 Bot Commands')
      .setDescription('Here are all available commands, organized by category.\nReach out to @PineFruit for any future requests.')
      .setColor(0x5865F2)
      .setTimestamp()
      .setFooter({ text: 'Use /help command:<name> for detailed help on a specific command' });

    // Add fields for each category
    for (const [categoryName, commands] of categories) {
      const commandList = commands
        .map(cmd => `\`/${cmd.getName()}\` - ${cmd.getDescription()}`)
        .join('\n');

      embed.addFields({
        name: `📂 ${categoryName}`,
        value: commandList,
        inline: false
      });
    }

    await interaction.reply({ embeds: [embed] });
  }

  // Autocomplete for command names
  public async autocomplete(interaction: any): Promise<any[]> {
    const focusedValue = interaction.options.getFocused();
    
    const choices = ALL_COMMANDS
      .filter(cmd => cmd.getName().startsWith(focusedValue.toLowerCase()))
      .slice(0, 25) // Discord limit
      .map(cmd => ({
        name: `${cmd.getName()} - ${cmd.getDescription()}`,
        value: cmd.getName()
      }));

    return choices;
  }
}
