import {
    ActionRowBuilder,
    ButtonInteraction,
    ModalBuilder,
    Snowflake,
    TextInputBuilder,
    TextInputStyle,
} from 'discord.js';

export async function handleReject(
    interaction: ButtonInteraction,
    id: Snowflake,
): Promise<void> {
    const reasonInput = new TextInputBuilder()
        .setCustomId('reason')
        .setLabel('Reason (optional)')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

    const row = new ActionRowBuilder<TextInputBuilder>().addComponents(
        reasonInput,
    );

    const modal = new ModalBuilder()
        .setCustomId(`reject-${id}`)
        .setTitle(`Reject Whitelist Application`)
        .setComponents(row);

    await interaction.showModal(modal);
}
