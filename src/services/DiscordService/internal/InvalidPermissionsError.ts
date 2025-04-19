import { DisplayableError } from '../../../errors/DisplayableError.js';

export class InvalidPermissionsError extends DisplayableError {
    public constructor() {
        super('You do not have permission to use this command.');
    }
}
