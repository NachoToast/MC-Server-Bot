import * as allServices from './services/index.js';
import { startAllTasks } from './tasks/index.js';
import { timestamp } from './utils/timestamp.js';

process.on('uncaughtException', (error) => {
    console.log('Uncaught exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.log('Unhandled rejection:', error);
    process.exit(1);
});

const services = Object.values(allServices);

const numServices = services.length.toString();

console.log(`[${timestamp()}] Starting ${numServices} Services...`);

await Promise.all(services.map((service) => service.initialise()));

console.log(`[${timestamp()}] All services running`);

await startAllTasks();

console.log(`[${timestamp()}] All background tasks started`);
