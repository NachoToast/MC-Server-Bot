import { ButtonInteraction, Snowflake } from 'discord.js';
import { DisplayableError } from '../../../../errors/DisplayableError.js';
import { EmbedHelpers } from '../../../../utils/index.js';
import { DatabaseService } from '../../../index.js';
import { tryGetMember } from '../../tryGetMember.js';

const PER_PAGE = 10;

export async function handleLogs(
    interaction: ButtonInteraction,
    id: Snowflake,
): Promise<void> {
    const [[logs, totalCount], fetchedUser, asMember] = await Promise.all([
        DatabaseService.getUserLogs(id, 1, PER_PAGE),
        DatabaseService.getUser(id),
        tryGetMember(id),
    ]);

    if (asMember === null) {
        throw new DisplayableError('User not found');
    }

    await interaction.reply(
        EmbedHelpers.makeLogsEmbed(
            fetchedUser,
            asMember.user,
            logs,
            1,
            PER_PAGE,
            totalCount,
        ),
    );
}
