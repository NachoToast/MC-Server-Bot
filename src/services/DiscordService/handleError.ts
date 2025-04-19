import {
    BaseMessageOptions,
    bold,
    channelMention,
    Interaction,
    InteractionType,
    RepliableInteraction,
    userMention,
} from 'discord.js';
import { DisplayableError } from '../../errors/DisplayableError.js';
import { adminChannel, developerID } from './internal/state.js';

function* parseErrorStack(stack: string): Generator<string> {
    yield '> ```js';

    for (let line of stack.split('\n').splice(1)) {
        if (line.includes('node_modules')) {
            continue;
        }

        const openIndex = line.indexOf('(');
        const closeIndex = line.indexOf(')');

        if (openIndex !== -1 && closeIndex !== -1) {
            const urlPath = line.slice(openIndex + 1, closeIndex);

            const srcIndex = urlPath.indexOf('src');

            if (srcIndex !== -1) {
                line =
                    line.slice(0, openIndex + 1) +
                    urlPath.slice(srcIndex + 4) +
                    line.slice(closeIndex);
            }
        }

        yield '> ' + line.trim();
    }

    yield '> ```';
}

async function handleNonDisplayableError(
    error: Error,
    interaction?: Interaction,
): Promise<void> {
    if (interaction?.isRepliable()) {
        handleDisplayableError(
            new DisplayableError(
                `An error occurred while handling your interaction and was reported`,
            ),
            interaction,
        ).catch(() => null);
    }

    const mainInfo: string[] = [];

    if (interaction === undefined) {
        mainInfo.push(`A non-interaction related error occurred in the bot`);
    } else {
        if (interaction.isChatInputCommand()) {
            mainInfo.push(
                `An error occurred in the ${bold(
                    interaction.commandName,
                )} command`,
            );
        } else {
            mainInfo.push(
                `An error occurred in an unknown interaction of type ${
                    InteractionType[interaction.type]
                }`,
            );
        }

        mainInfo.push(
            `User: ${userMention(interaction.user.id)} (${
                interaction.user.id
            })`,
        );

        if (interaction.channelId) {
            mainInfo.push(
                `Channel: ${channelMention(interaction.channelId)} (${
                    interaction.channelId
                })`,
            );
        }
    }

    if (error.name !== 'Error') {
        mainInfo.push(`Type: ${error.name}`);
    }

    mainInfo.push(`Message: ${error.message}`);

    if (error.stack !== undefined) {
        mainInfo.push(...parseErrorStack(error.stack));
    }

    await adminChannel.send({
        content: userMention(developerID) + ' ' + mainInfo.join('\n'),
        allowedMentions: { parse: [], users: [developerID] },
    });
}

async function handleDisplayableError(
    error: DisplayableError,
    interaction: RepliableInteraction,
): Promise<void> {
    const payload: BaseMessageOptions = {
        ...error.getPayload(),
        allowedMentions: { parse: [] },
    };

    if (interaction.replied) {
        await interaction.followUp(payload);
    } else if (interaction.deferred) {
        await interaction.editReply({ ...payload, flags: undefined });
    } else {
        await interaction.reply(payload);
    }
}

export function handleError(error: unknown, interaction?: Interaction): void {
    if (!(error instanceof Error)) {
        throw error;
    }

    let operation;

    if (error instanceof DisplayableError && interaction?.isRepliable()) {
        operation = handleDisplayableError(error, interaction);
    } else {
        operation = handleNonDisplayableError(error, interaction);
    }

    operation.catch(console.error);
}
