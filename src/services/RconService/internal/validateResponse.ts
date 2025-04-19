import { AlreadyWhitelistedError } from '../AlreadyWhitelistedError.js';
import { UsernameDoesNotExistError } from '../UsernameDoesNotExistError.js';
import { WasNeverWhitelistedError } from '../WasNeverWhitelistedError.js';
import { UnexpectedRconResponseError } from './UnexpectedRconResponseError.js';

export function validateResponse(
    response: string,
    username: string,
    operation: 'add' | 'remove',
): void {
    const responseL = response.toLowerCase();
    const usernameL = username.toLowerCase();

    let targetResponse: string;

    if (operation === 'add') {
        targetResponse = `added ${usernameL} to the whitelist`;
    } else {
        targetResponse = `removed ${usernameL} from the whitelist`;
    }

    switch (responseL) {
        case 'that player does not exist':
            throw new UsernameDoesNotExistError(username);

        case 'player is already whitelisted':
            throw new AlreadyWhitelistedError(username);

        case 'player is not whitelisted':
            throw new WasNeverWhitelistedError(username);

        case targetResponse:
            return;

        default:
            throw new UnexpectedRconResponseError(response);
    }
}
