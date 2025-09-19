import { 
  ChatInputCommandInteraction, 
  SlashCommandBuilder, 
  EmbedBuilder,
  PermissionsString
} from 'discord.js';
import { Command, CommandHelpInfo } from '../core/Command.js';
import { Logger } from '../services/Logger.js';

/**
 * Example command demonstrating advanced features:
 * - Subcommands
 * - Options
 * - Permissions
 * - Error handling
 * - Guild-only restriction
 */
export class ExampleCommand extends Command {
  public readonly data = new SlashCommandBuilder()
    .setName('example')
    .setDescription('Example command with advanced features')
    .addSubcommand(subcommand =>
      subcommand
        .setName('user')
        .setDescription('Get information about a user')
        .addUserOption(option =>
          option.setName('target')
            .setDescription('The user to get info about')
            .setRequired(false)
        )
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName('server')
        .setDescription('Get information about the server')
    );

  public readonly helpInfo: CommandHelpInfo = {
    name: 'example',
    description: 'Example command demonstrating subcommands, options, and advanced features',
    usage: '/example <user|server> [target]',
    examples: [
      '/example user',
      '/example user target:@john',
      '/example server'
    ],
    category: 'Example'
  };

  // Command configuration
  public readonly requiredPermissions: PermissionsString[] = ['SendMessages'];
  public readonly guildOnly = true;

  public async execute(interaction: ChatInputCommandInteraction): Promise<void> {
    const subcommand = interaction.options.getSubcommand();

    try {
      switch (subcommand) {
        case 'user':
          await this.handleUserSubcommand(interaction);
          break;
        
        case 'server':
          await this.handleServerSubcommand(interaction);
          break;
        
        default:
          await interaction.reply({
            content: '❌ Unknown subcommand.',
            ephemeral: true
          });
      }
    } catch (error) {
      Logger.error(`Error in example command subcommand ${subcommand}:`, error);
      throw error; // Re-throw to be handled by main error handler
    }
  }

  private async handleUserSubcommand(interaction: ChatInputCommandInteraction): Promise<void> {
    const targetUser = interaction.options.getUser('target') || interaction.user;
    const member = interaction.guild?.members.cache.get(targetUser.id);

    const embed = new EmbedBuilder()
      .setTitle(`👤 User Information`)
      .setDescription(`Information about ${targetUser.tag}`)
      .setColor(0x00AE86)
      .setThumbnail(targetUser.displayAvatarURL())
      .addFields(
        {
          name: '📊 Basic Info',
          value: [
            `**Username:** ${targetUser.username}`,
            `**Display Name:** ${targetUser.displayName}`,
            `**ID:** ${targetUser.id}`,
            `**Bot:** ${targetUser.bot ? 'Yes' : 'No'}`
          ].join('\n'),
          inline: true
        },
        {
          name: '📅 Dates',
          value: [
            `**Account Created:** <t:${Math.floor(targetUser.createdTimestamp / 1000)}:F>`,
            `**Joined Server:** ${member ? `<t:${Math.floor(member.joinedTimestamp! / 1000)}:F>` : 'Not in server'}`
          ].join('\n'),
          inline: true
        }
      )
      .setTimestamp();

    if (member) {
      embed.addFields({
        name: '🎭 Roles',
        value: member.roles.cache.size > 1 
          ? member.roles.cache
              .filter(role => role.name !== '@everyone')
              .map(role => role.toString())
              .join(', ')
          : 'No roles',
        inline: false
      });
    }

    await interaction.reply({ embeds: [embed] });
  }

  private async handleServerSubcommand(interaction: ChatInputCommandInteraction): Promise<void> {
    const guild = interaction.guild!;

    const embed = new EmbedBuilder()
      .setTitle(`🏰 Server Information`)
      .setDescription(`Information about ${guild.name}`)
      .setColor(0x5865F2)
      .setThumbnail(guild.iconURL())
      .addFields(
        {
          name: '📊 Statistics',
          value: [
            `**Members:** ${guild.memberCount}`,
            `**Channels:** ${guild.channels.cache.size}`,
            `**Roles:** ${guild.roles.cache.size}`,
            `**Emojis:** ${guild.emojis.cache.size}`
          ].join('\n'),
          inline: true
        },
        {
          name: '👑 Server Details',
          value: [
            `**Owner:** <@${guild.ownerId}>`,
            `**Created:** <t:${Math.floor(guild.createdTimestamp / 1000)}:F>`,
            `**Verification:** ${guild.verificationLevel}`,
            `**Boost Level:** ${guild.premiumTier}`
          ].join('\n'),
          inline: true
        }
      )
      .setTimestamp();

    if (guild.description) {
      embed.addFields({
        name: '📝 Description',
        value: guild.description,
        inline: false
      });
    }

    await interaction.reply({ embeds: [embed] });
  }
}
