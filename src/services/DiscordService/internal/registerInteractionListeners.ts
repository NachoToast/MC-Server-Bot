import { Events, Interaction, InteractionType } from 'discord.js';
import { DisplayableError } from '../../../errors/DisplayableError.js';
import { handleError } from '../handleError.js';
import { handleButton } from './handleButton.js';
import { handleCommand } from './handleCommand.js';
import { handleModal } from './handleModal.js';
import { client } from './state.js';

// eslint-disable-next-line @typescript-eslint/require-await
async function handleUnknownInteraction(
    interaction: Interaction,
): Promise<void> {
    throw new DisplayableError(
        `Unknown interaction type: ${InteractionType[interaction.type]}`,
    );
}

export function registerInteractionListeners(): void {
    client.on(Events.InteractionCreate, (interaction) => {
        let operation: Promise<void>;

        if (interaction.isChatInputCommand()) {
            operation = handleCommand(interaction);
        } else if (interaction.isButton()) {
            operation = handleButton(interaction);
        } else if (interaction.isModalSubmit()) {
            operation = handleModal(interaction);
        } else {
            operation = handleUnknownInteraction(interaction);
        }

        operation.catch((error: unknown) => {
            handleError(error, interaction);
        });
    });
}
