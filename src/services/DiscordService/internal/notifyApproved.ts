import { GuildMember, MessageFlags, userMention } from 'discord.js';
import { MinecraftUser } from '../../../types/MinecraftUser.js';
import { publicChannel } from './state.js';

export async function notifyApproved(
    user: MinecraftUser,
    approvedBy: GuildMember,
): Promise<void> {
    await publicChannel.send({
        content: `${userMention(
            user.discordId,
        )} Your whitelist application has been approved by ${userMention(
            approvedBy.id,
        )}, have fun!`,
        allowedMentions: {
            parse: [],
            users: [user.discordId],
        },
        flags: MessageFlags.SuppressNotifications,
    });
}
