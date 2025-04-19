import { GuildMember } from 'discord.js';
import { notificationRole } from './internal/state.js';

export async function toggleRole(member: GuildMember): Promise<boolean> {
    if (member.roles.cache.has(notificationRole.id)) {
        await member.roles.remove(notificationRole);
        return false;
    }

    await member.roles.add(notificationRole);
    return true;
}
