import { userMention } from 'discord.js';
import { DatabaseService, RconService } from '../services/index.js';
import { CommandPermissionLevel } from '../types/CommandPermissionLevel.js';
import { Command } from './Command.js';

export const whitelistDeleteCommand: Command = {
    permissionLevel: CommandPermissionLevel.DeveloperOnly,

    name: 'whitelist-delete',

    description: 'Delete a whitelist database entry entirely',

    build(base) {
        base.addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The Discord user associated with the entry')
                .setRequired(true),
        );
    },

    async execute(interaction) {
        const user = interaction.options.getUser('user', true);

        const deletedUser = await DatabaseService.deleteUser(user.id);

        try {
            await RconService.removeFromWhitelist(
                deletedUser.minecraftUsername,
            );
        } catch (error) {
            if (
                !(error instanceof RconService.WasNeverWhitelistedError) &&
                !(error instanceof RconService.UsernameDoesNotExistError)
            ) {
                throw error;
            }
        }

        await interaction.reply({
            content: `Deleted whitelist entry for ${userMention(user.id)} (${
                deletedUser.minecraftUsername
            })`,
            allowedMentions: { parse: [] },
        });
    },
};
