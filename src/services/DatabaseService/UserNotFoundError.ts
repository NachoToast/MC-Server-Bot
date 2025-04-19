import { bold, userMention } from 'discord.js';
import { DisplayableError } from '../../errors/DisplayableError.js';

export class UserNotFoundError extends DisplayableError {
    public constructor(payload: string, type: 'discord' | 'minecraft') {
        if (type === 'discord') {
            super(`${userMention(payload)} does not have any applications`);
        } else {
            super(`${bold(payload)} does not have any applications`);
        }
    }
}
