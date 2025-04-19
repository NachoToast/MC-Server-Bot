import { bold } from 'discord.js';
import { DisplayableError } from '../../errors/DisplayableError.js';

export class WasNeverWhitelistedError extends DisplayableError {
    public constructor(username: string) {
        super(`${bold(username)} was never whitelisted!`);
    }
}
