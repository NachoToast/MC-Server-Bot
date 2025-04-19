import { bold, GuildMember, userMention } from 'discord.js';
import { MinecraftUser } from '../../../types/MinecraftUser.js';
import { publicChannel } from './state.js';

export async function notifyRejected(
    user: MinecraftUser,
    rejectedBy: GuildMember,
): Promise<void> {
    await publicChannel.send({
        content: `${userMention(
            user.discordId,
        )} Your whitelist application has been ${bold(
            'rejected',
        )} by ${userMention(rejectedBy.id)}`,
        allowedMentions: {
            parse: [],
            users: [user.discordId],
        },
    });
}
