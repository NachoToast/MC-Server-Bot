import { rcon } from './internal/state.js';
import { validateResponse } from './internal/validateResponse.js';

export async function removeFromWhitelist(username: string): Promise<void> {
    const response = await rcon.send(`whitelist remove ${username}`);

    validateResponse(response, username, 'remove');
}
