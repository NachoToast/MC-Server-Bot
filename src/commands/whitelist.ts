import { bold } from 'discord.js';
import { DisplayableError } from '../errors/DisplayableError.js';
import {
    DatabaseService,
    DiscordService,
    RconService,
} from '../services/index.js';
import { CommandPermissionLevel } from '../types/CommandPermissionLevel.js';
import { MinecraftUserState } from '../types/UserState.js';
import { Command } from './Command.js';

const validUsernameRegexp = /^[a-zA-Z0-9_]{3,16}$/;

export const whitelistCommand: Command = {
    permissionLevel: CommandPermissionLevel.Everyone,

    name: 'whitelist',

    description: 'Make an application to be whitelisted on the server',

    build(base) {
        base.addStringOption((option) =>
            option
                .setName('username')
                .setDescription('Your Minecraft username')
                .setRequired(true)
                .setMinLength(3)
                .setMaxLength(16),
        );
    },

    async execute(interaction, member): Promise<void> {
        const username = interaction.options.getString('username', true);

        if (!validUsernameRegexp.test(username)) {
            throw new DisplayableError(
                `Invalid username, Minecraft usernames can only contain letters, numbers and underscores`,
            );
        }

        await interaction.deferReply();

        try {
            const existingUser = await DatabaseService.getUser(member.id);

            const isSameUsername = existingUser.minecraftUsername === username;
            let replyMessage: string;

            switch (existingUser.state) {
                case MinecraftUserState.Pending:
                    replyMessage = isSameUsername
                        ? `Your existing whitelist application is still pending`
                        : `You already have a pending application as ${bold(
                              existingUser.minecraftUsername,
                          )}`;
                    break;
                case MinecraftUserState.Rejected:
                    replyMessage = isSameUsername
                        ? `Your whitelist application has been rejected`
                        : `You have a previous application as ${bold(
                              existingUser.minecraftUsername,
                          )} that was rejected`;
                    break;
                case MinecraftUserState.Accepted:
                    replyMessage = isSameUsername
                        ? `You are already whitelisted!`
                        : `You are already whitelisted as ${bold(
                              existingUser.minecraftUsername,
                          )}`;
                    break;
            }

            throw new DisplayableError(replyMessage);
        } catch (error) {
            if (!(error instanceof DatabaseService.UserNotFoundError)) {
                throw error;
            }
        }

        // check username is valid by adding and then removing it
        await RconService.addToWhitelist(username);
        await RconService.removeFromWhitelist(username);

        const user = await DatabaseService.createUser(member.id, username);

        await Promise.allSettled([
            interaction.editReply(
                `Your application has been submitted, you'll get a notification when one of our staff members has reviewed it!`,
            ),
            DiscordService.notifyCreated(member, user),
        ]);
    },
};
