import {
    ButtonInteraction,
    GuildMember,
    PermissionFlagsBits,
} from 'discord.js';
import { DisplayableError } from '../../../errors/DisplayableError.js';
import { handleAccept } from './button-interactions/handleAccept.js';
import { handleLogs } from './button-interactions/handleLogs.js';
import { handleReject } from './button-interactions/handleReject.js';

export async function handleButton(
    interaction: ButtonInteraction,
): Promise<void> {
    const { member } = interaction;

    if (!(member instanceof GuildMember)) {
        throw new DisplayableError('This button can only be used in a server');
    }

    if (!member.permissions.has(PermissionFlagsBits.BanMembers)) {
        throw new DisplayableError(
            'You do not have permission to do this action',
        );
    }

    const args = interaction.customId.split('-');

    const action = args.at(0);
    const arg = args.at(1);

    if (action === undefined || arg === undefined) {
        throw new DisplayableError(
            `Unknown button action: ${interaction.customId}`,
        );
    }

    switch (action) {
        case 'accept':
            await handleAccept(interaction, member, arg);
            break;
        case 'reject':
            await handleReject(interaction, arg);
            break;
        case 'logs':
            await handleLogs(interaction, arg);
            break;
        default:
            throw new DisplayableError(`Unknown button action: ${action}`);
    }
}
