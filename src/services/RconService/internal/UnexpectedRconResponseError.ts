import { DisplayableError } from '../../../errors/DisplayableError.js';

export class UnexpectedRconResponseError extends DisplayableError {
    public constructor(response: string) {
        super(`Unexpected RCON response: \`${response}\``);
    }
}
