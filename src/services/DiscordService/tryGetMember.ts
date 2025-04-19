import { DiscordAPIError, GuildMember, Snowflake } from 'discord.js';
import { mainGuild } from './internal/state.js';

export async function tryGetMember(
    discordId: Snowflake,
): Promise<GuildMember | null> {
    try {
        return await mainGuild.members.fetch(discordId);
    } catch (error) {
        if (error instanceof DiscordAPIError && error.code === 10013) {
            return null;
        }

        throw error;
    }
}
