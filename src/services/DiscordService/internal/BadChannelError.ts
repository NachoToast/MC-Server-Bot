import {
    channelMention,
    InteractionReplyOptions,
    MessageFlags,
} from 'discord.js';
import { DisplayableError } from '../../../errors/DisplayableError.js';
import { adminChannel } from './state.js';

export class BadChannelError extends DisplayableError {
    public constructor() {
        super(
            `This command can only be used in ${channelMention(
                adminChannel.id,
            )}`,
        );
    }

    public override getPayload(): InteractionReplyOptions {
        return {
            ...super.getPayload(),
            flags: MessageFlags.Ephemeral,
        };
    }
}
