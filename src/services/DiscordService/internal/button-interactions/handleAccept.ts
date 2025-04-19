import {
    ButtonInteraction,
    GuildMember,
    Snowflake,
    time,
    TimestampStyles,
    userMention,
} from 'discord.js';
import { MinecraftUserState } from '../../../../types/UserState.js';
import { DatabaseService, RconService } from '../../../index.js';
import { notifyApproved } from '../notifyApproved.js';

export async function handleAccept(
    interaction: ButtonInteraction,
    member: GuildMember,
    id: Snowflake,
): Promise<void> {
    const user = await DatabaseService.updateUser(
        id,
        MinecraftUserState.Accepted,
        null,
        member.id,
    );

    await RconService.addToWhitelist(user.minecraftUsername);

    await Promise.allSettled([
        interaction.message.edit({
            content: `Approved by ${userMention(member.id)} ${time(
                new Date(),
                TimestampStyles.RelativeTime,
            )}`,
            components: [],
            allowedMentions: { parse: [] },
        }),
        notifyApproved(user, member),
    ]);
}
