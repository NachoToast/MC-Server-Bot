import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    GuildMember,
    roleMention,
} from 'discord.js';
import { MinecraftUser } from '../../types/MinecraftUser.js';
import { EmbedHelpers } from '../../utils/index.js';
import { adminChannel, notificationRole } from './internal/state.js';

export async function notifyCreated(
    member: GuildMember,
    user: MinecraftUser,
): Promise<void> {
    const embed = EmbedHelpers.makeEmbed(user, member).setTitle(
        'New Whitelist Application',
    );

    const approveButton = new ButtonBuilder()
        .setCustomId(`accept-${member.id}`)
        .setLabel('Approve')
        .setStyle(ButtonStyle.Success);

    const rejectButton = new ButtonBuilder()
        .setCustomId(`reject-${member.id}`)
        .setLabel('Reject')
        .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        approveButton,
        rejectButton,
    );

    await adminChannel.send({
        content: roleMention(notificationRole.id),
        embeds: [embed],
        components: [row],
        allowedMentions: {
            parse: [],
            roles: [notificationRole.id],
        },
    });
}
