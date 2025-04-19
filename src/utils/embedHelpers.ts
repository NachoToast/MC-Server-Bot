import {
    BaseMessageOptions,
    ColorResolvable,
    EmbedBuilder,
    GuildMember,
    TimestampStyles,
    User,
    bold,
    time,
    userMention,
} from 'discord.js';
import { MinecraftUser } from '../types/MinecraftUser.js';
import { MinecraftUserLog } from '../types/MinecraftUserLog.js';
import { MinecraftUserState } from '../types/UserState.js';

const ONE_DAY = 1_000 * 60 * 60 * 24;

function accountAgeFactor(member: GuildMember): string {
    const createdAt = member.user.createdAt;

    const daysOld = Math.floor((Date.now() - createdAt.getTime()) / ONE_DAY);

    let outputMessage;

    if (daysOld < 365) {
        outputMessage = `⚠️ Account only created`;
    } else {
        outputMessage = `✅ Account created`;
    }

    return `${outputMessage} ${time(createdAt, TimestampStyles.RelativeTime)}`;
}

function serverAgeFactor(member: GuildMember): string {
    const joinedAt = member.joinedAt;

    let outputMessage;

    if (joinedAt === null) {
        return `❔ Joined server ${bold('at an unknown date')}`;
    }

    const daysOld = Math.floor((Date.now() - joinedAt.getTime()) / ONE_DAY);

    if (daysOld < 1) {
        outputMessage = `⚠️ Only joined server`;
    } else {
        outputMessage = `✅ Joined server`;
    }

    return `${outputMessage} ${time(joinedAt, TimestampStyles.RelativeTime)}`;
}

export function makeEmbed(
    user: MinecraftUser,
    member: GuildMember | null,
    ...description: string[]
): EmbedBuilder {
    const output = new EmbedBuilder().setColor(colorForState(user.state));

    const fullDescription = [
        `${userMention(user.discordId)} // ${user.minecraftUsername}`,
        ...description,
    ];

    if (member !== null) {
        fullDescription.push(accountAgeFactor(member), serverAgeFactor(member));

        output.setThumbnail(member.displayAvatarURL());
    }

    output.setDescription(fullDescription.join('\n\n'));

    return output;
}

export function makeLogsEmbed(
    user: MinecraftUser,
    member: User,
    logs: MinecraftUserLog[],
    page: number,
    perPage: number,
    totalCount: number,
): BaseMessageOptions {
    if (logs.length === 0) {
        return {
            content: `No logs found for ${userMention(user.discordId)}${
                page !== 1 ? ` on page ${page.toLocaleString()}` : ''
            }`,
            allowedMentions: { parse: [] },
        };
    }

    const embed = new EmbedBuilder()
        .setAuthor({
            name: `Logs for ${member.displayName}`,
            iconURL: member.displayAvatarURL(),
        })
        .setColor(colorForState(user.state));

    for (let i = 0; i < logs.length; i++) {
        const log = logs[i];

        const from = bold(labelForState(log.previousState));
        const to = bold(
            labelForState(logs.at(i - 1)?.previousState ?? user.state),
        );
        const reason = log.reason !== null ? ` with reason: ${log.reason}` : '';

        embed.addFields({
            name: time(log.doneAt, TimestampStyles.RelativeTime),
            value: `${userMention(
                log.doneBy,
            )} changed from ${from} to ${to}${reason}`,
        });
    }

    const start = bold(((page - 1) * perPage + 1).toLocaleString());
    const end = bold(Math.min(page * perPage, totalCount).toLocaleString());
    const total = bold(totalCount.toLocaleString());
    const logS = `log${totalCount !== 1 ? 's' : ''}`;

    return {
        content: `Showing ${start} - ${end} of ${total} ${logS} for ${userMention(
            member.id,
        )}`,
        embeds: [embed],
        allowedMentions: { parse: [] },
    };
}

export function labelForState(state: MinecraftUserState): string {
    switch (state) {
        case MinecraftUserState.Pending:
            return 'Pending';
        case MinecraftUserState.Accepted:
            return 'Accepted';
        case MinecraftUserState.Rejected:
            return 'Rejected';
    }
}

export function colorForState(state: MinecraftUserState): ColorResolvable {
    switch (state) {
        case MinecraftUserState.Pending:
            return 'Blurple';
        case MinecraftUserState.Accepted:
            return 'Green';
        case MinecraftUserState.Rejected:
            return 'Red';
    }
}
