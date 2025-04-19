import {
    bold,
    GuildMember,
    MessageFlags,
    ModalSubmitInteraction,
    PermissionFlagsBits,
    time,
    TimestampStyles,
    userMention,
} from 'discord.js';
import { DisplayableError } from '../../../errors/DisplayableError.js';
import { MinecraftUserState } from '../../../types/UserState.js';
import { DatabaseService } from '../../index.js';
import { notifyRejected } from './notifyRejected.js';

export async function handleModal(
    interaction: ModalSubmitInteraction,
): Promise<void> {
    const { member } = interaction;

    if (!(member instanceof GuildMember)) {
        throw new DisplayableError('This modal can only be used in a server');
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

    if (action !== 'reject') {
        throw new DisplayableError(
            `Unknown modal action: ${interaction.customId}`,
        );
    }

    const reason =
        interaction.fields.getTextInputValue('reason').trim() || null;

    const user = await DatabaseService.updateUser(
        arg,
        MinecraftUserState.Rejected,
        null,
        member.id,
    );

    await Promise.allSettled([
        interaction.message?.edit({
            content: `${bold('Rejected')} by ${userMention(member.id)} ${time(
                new Date(),
                TimestampStyles.RelativeTime,
            )}${reason !== null ? `\nReason: ${reason}` : ''}`,
            components: [],
            allowedMentions: { parse: [] },
        }),
        notifyRejected(user, member),
        interaction.reply({
            content: `Rejected successfully`,
            flags: MessageFlags.Ephemeral,
        }),
    ]);
}
