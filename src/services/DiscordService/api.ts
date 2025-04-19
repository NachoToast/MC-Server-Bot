import { deployCommands } from './internal/deployCommands.js';
import { registerInteractionListeners } from './internal/registerInteractionListeners.js';
import { initialiseState } from './internal/state.js';

export { getClient } from './getClient.js';
export { handleError } from './handleError.js';
export { notifyCreated } from './notifyCreated.js';
export { toggleRole } from './toggleRole.js';
export { tryGetMember } from './tryGetMember.js';

export async function initialise(): Promise<void> {
    await initialiseState();

    registerInteractionListeners();

    await deployCommands();
}
