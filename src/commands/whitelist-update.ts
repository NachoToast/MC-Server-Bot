import { bold } from 'discord.js';
import { DatabaseService } from '../services/index.js';
import { CommandPermissionLevel } from '../types/CommandPermissionLevel.js';
import { MinecraftUserState } from '../types/UserState.js';
import { EmbedHelpers } from '../utils/index.js';
import { Command } from './Command.js';

export const whitelistUpdateCommand: Command = {
    permissionLevel: CommandPermissionLevel.DeveloperOnly,

    name: 'whitelist-update',

    description: 'Explicitly update the state of a whitelist entry',

    build(base) {
        base.addUserOption((option) =>
            option
                .setName('user')
                .setDescription('The Discord user associated with the entry')
                .setRequired(true),
        )
            .addIntegerOption((option) =>
                option
                    .setName('new-state')
                    .setDescription('The new state of the entry')
                    .setChoices(
                        [
                            MinecraftUserState.Pending,
                            MinecraftUserState.Accepted,
                            MinecraftUserState.Rejected,
                        ].map((value) => ({
                            name: EmbedHelpers.labelForState(value),
                            value: value,
                        })),
                    )
                    .setRequired(true),
            )
            .addStringOption((option) =>
                option
                    .setName('reason')
                    .setDescription('The reason for this update'),
            );
    },

    async execute(interaction, member) {
        const user = interaction.options.getUser('user', true);

        const newState = interaction.options.getInteger(
            'new-state',
            true,
        ) as MinecraftUserState;

        const reason = interaction.options.getString('reason');

        await interaction.deferReply();

        const updatedUser = await DatabaseService.updateUser(
            user.id,
            newState,
            reason,
            member.id,
        );

        await interaction.editReply({
            content: `Updated the entry for ${bold(
                updatedUser.minecraftUsername,
            )} to ${bold(EmbedHelpers.labelForState(newState))}`,
            allowedMentions: { parse: [] },
        });
    },
};
