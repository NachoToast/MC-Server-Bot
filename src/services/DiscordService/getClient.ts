import { Client } from 'discord.js';
import { client } from './internal/state.js';

export function getClient(): Client<true> {
    return client;
}
