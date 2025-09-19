import { 
  ChatInputCommandInteraction, 
  SlashCommandBuilder, 
  EmbedBuilder,
  version as djsVersion 
} from 'discord.js';
import { Command, CommandHelpInfo } from '../core/Command.js';

/**
 * Info command - demonstrates embed usage and bot information
 */
export class InfoCommand extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName('info')
    .setDescription('Get information about the bot');

  public readonly helpInfo: CommandHelpInfo = {
    name: 'info',
    description: 'Get detailed information about the bot including statistics and technical details',
    usage: '/info',
    examples: ['/info'],
    category: 'Utility'
  };

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const client = interaction.client;
    const uptime = this.formatUptime(client.uptime || 0);
    
    const embed = new EmbedBuilder()
      .setTitle('🤖 Bot Information')
      .setDescription('A Discord bot built with the modular template system')
      .setColor(0x5865F2)
      .addFields(
        {
          name: '📊 Statistics',
          value: [
            `**Servers:** ${client.guilds.cache.size}`,
            `**Users:** ${client.users.cache.size}`,
            `**Channels:** ${client.channels.cache.size}`,
            `**Uptime:** ${uptime}`
          ].join('\n'),
          inline: true
        },
        {
          name: '⚙️ Technical',
          value: [
            `**Discord.js:** v${djsVersion}`,
            `**Node.js:** ${process.version}`,
            `**Memory:** ${this.formatMemory()}`,
            `**Ping:** ${client.ws.ping}ms`
          ].join('\n'),
          inline: true
        }
      )
      .setTimestamp()
      .setFooter({ 
        text: `Requested by ${interaction.user.tag}`, 
        iconURL: interaction.user.displayAvatarURL() 
      });

    await interaction.reply({ embeds: [embed] });
  }

  private formatUptime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ${hours % 24}h ${minutes % 60}m`;
    if (hours > 0) return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  private formatMemory(): string {
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    return `${Math.round(used * 100) / 100} MB`;
  }
}
