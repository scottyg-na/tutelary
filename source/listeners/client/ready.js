import { Listener } from 'discord-akairo';
import { createOrUpdateServer } from 'repositories/server';

export default class ClientReadyListener extends Listener {
    constructor() {
        super('client:ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec() {
        this.client.logger.info('Client ready...');

        // Create our server config if it doesn't already exist.
        Array.from(this.client.guilds.cache).forEach(async([id, guild])=> {
            try {
                await createOrUpdateServer(this.client, guild);
            } catch(e) {
                 this.client.logger.warn(e.message);
            }
        });

        // Start CronJobs here so they can be initialised.
        this.client.handlers.cron.modules.forEach(module => {
            module.create();
        });
    }
}