import { Rcon } from 'rcon-client';
import { EnvHelpers } from '../../../utils/index.js';

export let rcon: Rcon;

export async function initialiseState(): Promise<void> {
    const host = EnvHelpers.getStringOrThrow('RCON_HOST');
    const port = EnvHelpers.getPortOrThrow('RCON_PORT');
    const password = EnvHelpers.getStringOrThrow('RCON_PASSWORD');

    rcon = new Rcon({ host, port, password });

    rcon.on('error', (error) => {
        console.error(`RCON client error`, error);
        process.exit(-1);
    });

    await rcon.connect();
}
