import { rcon } from './internal/state.js';
import { validateResponse } from './internal/validateResponse.js';

export async function addToWhitelist(username: string): Promise<void> {
    const response = await rcon.send(`whitelist add ${username}`);

    validateResponse(response, username, 'add');
}
