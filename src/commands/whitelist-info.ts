import { ActionRowBuilder, bold, ButtonBuilder, ButtonStyle } from 'discord.js';
import { DatabaseService, DiscordService } from '../services/index.js';
import { CommandPermissionLevel } from '../types/CommandPermissionLevel.js';
import { EmbedHelpers } from '../utils/index.js';
import { Command } from './Command.js';

export const whitelistInfoCommand: Command = {
    permissionLevel: CommandPermissionLevel.AdminsOnly,

    name: 'whitelist-info',

    description: `Get information about a user's whitelist application`,

    build(base) {
        base.addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The Discord user to get info for')
                .setRequired(true),
        );
    },

    async execute(interaction) {
        const targetUser = interaction.options.getUser('user', true);

        await interaction.deferReply();

        const user = await DatabaseService.getUser(targetUser.id);

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
