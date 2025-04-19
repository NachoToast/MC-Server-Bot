import { ActionRowBuilder, bold, ButtonBuilder, ButtonStyle } from 'discord.js';
import { DatabaseService, DiscordService } from '../services/index.js';
import { CommandPermissionLevel } from '../types/CommandPermissionLevel.js';
import { EmbedHelpers } from '../utils/index.js';
import { Command } from './Command.js';

export const whitelistSearchCommand: Command = {
    permissionLevel: CommandPermissionLevel.AdminsOnly,

    name: 'whitelist-search',

    description: 'Search for a whitelist entry by Minecraft username',

    build(base) {
        base.addStringOption((option) =>
            option
                .setName('username')
                .setDescription('The Minecraft username to search for')
                .setRequired(true)
                .setMinLength(3)
                .setMaxLength(16),
        );
    },

    async execute(interaction) {
        const username = interaction.options.getString('username', true);

        await interaction.deferReply();

        const user = await DatabaseService.searchUsers(username);

        const member = await DiscordService.tryGetMember(user.discordId);

        const embed = EmbedHelpers.makeEmbed(
            user,
            member,
            bold(EmbedHelpers.labelForState(user.state)),
        ).setTitle(`Whitelist Info`);

        const fetchLogsButton = new ButtonBuilder()
            .setCustomId(`logs-${user.discordId}`)
            .setLabel(`Fetch Logs`)
            .setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
            fetchLogsButton,
        );

        await interaction.editReply({ embeds: [embed], components: [row] });
    },
};
