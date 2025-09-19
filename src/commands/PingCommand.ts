import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { Command, CommandHelpInfo } from '../core/Command.js';

/**
 * Simple ping command - demonstrates basic command structure
 */
export class PingCommand extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check if the bot is responding');

  public readonly helpInfo: CommandHelpInfo = {
    name: 'ping',
    description: 'Check if the bot is responding and get latency information',
    usage: '/ping',
    examples: ['/ping'],
    category: 'Utility'
  };

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const sent = await interaction.reply({ 
      content: 'Pinging...', 
      fetchReply: true 
    });

    const latency = sent.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);

    await interaction.editReply(
      `🏓 **Pong!**\n` +
      `📡 **Latency:** ${latency}ms\n` +
      `💓 **API Latency:** ${apiLatency}ms`
    );
  }
}
