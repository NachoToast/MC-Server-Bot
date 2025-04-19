import { bold } from 'discord.js';
import { DisplayableError } from '../../errors/DisplayableError.js';

export class UsernameDoesNotExistError extends DisplayableError {
    public constructor(username: string) {
        super(`Couldn't find a user with the username ${bold(username)}`);
    }
}
