import { InteractionReplyOptions } from 'discord.js';

/** An error that can be safely displayed to the end-user. */
export class DisplayableError extends Error {
    public constructor(message: string) {
        super(message);
    }

    public getPayload(): InteractionReplyOptions {
        return { content: this.message };
    }
}
