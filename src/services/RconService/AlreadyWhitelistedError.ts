import { bold } from 'discord.js';
import { DisplayableError } from '../../errors/DisplayableError.js';

export class AlreadyWhitelistedError extends DisplayableError {
    public constructor(username: string) {
        super(`${bold(username)} is already whitelisted!`);
    }
}
