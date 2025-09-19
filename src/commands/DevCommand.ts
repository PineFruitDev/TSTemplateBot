import { 
  ChatInputCommandInteraction, 
  SlashCommandBuilder, 
  EmbedBuilder 
} from 'discord.js';
import { Command, CommandHelpInfo } from '../core/Command.js';
import { Environment } from '../services/Environment.js';

/**
 * Developer-only command for testing and debugging
 */
export class DevCommand extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName('dev')
    .setDescription('Developer-only command for testing and debugging')
    .addSubcommand(subcommand =>
      subcommand
        .setName('info')
        .setDescription('Show development information')
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('test')
        .setDescription('Run a test command')
    );

  public readonly helpInfo: CommandHelpInfo = {
    name: 'dev',
    description: 'Developer-only command for testing, debugging, and development information',
    usage: '/dev <info|test>',
    examples: ['/dev info', '/dev test'],
    category: 'Developer'
  };

  // Configuration
  public readonly developerOnly = true;

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const subcommand = interaction.options.getSubcommand();

    switch (subcommand) {
      case 'info':
        await this.handleInfo(interaction);
        break;
      case 'test':
        await this.handleTest(interaction);
        break;
    }
  }

  private async handleInfo(interaction: ChatInputCommandInteraction): Promise<void> {
    const config = Environment.getConfig();
    
    const embed = new EmbedBuilder()
      .setTitle('🔧 Development Information')
      .setDescription('Internal bot information for developers')
      .setColor(0xFF6B35)
      .addFields(
        {
          name: '🌍 Environment',
          value: [
            `**Mode**: ${config.nodeEnv}`,
            `**Development**: ${config.isDevelopment ? 'Yes' : 'No'}`,
            `**Production**: ${config.isProduction ? 'Yes' : 'No'}`
          ].join('\n'),
          inline: true
        },
        {
          name: '👥 Developers',
          value: [
            `**Count**: ${config.developerIds.length}`,
            `**IDs**: ${config.developerIds.length > 0 ? config.developerIds.join(', ') : 'None configured'}`
          ].join('\n'),
          inline: true
        },
        {
          name: '⚡ Process',
          value: [
            `**Node.js**: ${process.version}`,
            `**PID**: ${process.pid}`,
            `**Uptime**: ${Math.floor(process.uptime())}s`,
            `**Memory**: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`
          ].join('\n'),
          inline: false
        }
      )
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}` });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }

  private async handleTest(interaction: ChatInputCommandInteraction): Promise<void> {
    const startTime = Date.now();
    
    await interaction.reply({
      content: '🧪 Running developer test...',
      ephemeral: true
    });

    // Simulate some work
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const endTime = Date.now();
    const duration = endTime - startTime;

    await interaction.editReply({
      content: `✅ **Developer test completed!**\n\n` +
               `⏱️ **Duration**: ${duration}ms\n` +
               `🤖 **Bot Status**: Operational\n` +
               `📡 **API Latency**: ${interaction.client.ws.ping}ms\n` +
               `🔧 **Environment**: ${Environment.getConfig().nodeEnv}`
    });
  }
}
