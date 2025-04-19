import {
    ChatInputCommandInteraction,
    GuildMember,
    PermissionFlagsBits,
} from 'discord.js';
import * as allCommands from '../../../commands/index.js';
import { DisplayableError } from '../../../errors/DisplayableError.js';
import { BadChannelError } from './BadChannelError.js';
import { getPermissionsFor } from './getPermissionFor.js';
import { InvalidPermissionsError } from './InvalidPermissionsError.js';
import { adminChannel } from './state.js';

const commandMap = new Map(
    Object.values(allCommands).map((command) => [command.name, command]),
);

export async function handleCommand(
    interaction: ChatInputCommandInteraction,
): Promise<void> {
    const { member } = interaction;

    if (!(member instanceof GuildMember)) {
        throw new DisplayableError('This command can only be used in a server');
    }

    const command = commandMap.get(interaction.commandName);

    if (command === undefined) {
        throw new DisplayableError('Command not found');
    }

    const requiredPermissions = getPermissionsFor(command.permissionLevel);

    if (requiredPermissions !== null) {
        if (!member.permissions.has(PermissionFlagsBits.BanMembers)) {
            throw new InvalidPermissionsError();
        }

        if (interaction.channel !== adminChannel) {
            throw new BadChannelError();
        }
    }

    await command.execute(interaction, member);
}
