import { DiscordService } from '../services/index.js';
import { CommandPermissionLevel } from '../types/CommandPermissionLevel.js';
import { Command } from './Command.js';

export const whitelistSubscribeCommand: Command = {
    permissionLevel: CommandPermissionLevel.AdminsOnly,

    name: 'whitelist-subscribe',

    description: 'Toggle notifications for new whitelist applications',

    async execute(interaction, member) {
        if (await DiscordService.toggleRole(member)) {
            await interaction.reply({
                content: `You will now be notified about new whitelist applications`,
            });
        } else {
            await interaction.reply({
                content: `You will no longer be notified about new whitelist applications`,
            });
        }
    },
};
