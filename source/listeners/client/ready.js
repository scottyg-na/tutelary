const { Listener } = require('discord-akairo');

export default class ClientReadyListener extends Listener {
    constructor() {
        super('client:ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec() {
        this.client.logger.info('Client ready...');

        // Start CronJobs here so they can be initialised.
        this.client.handlers.cron.modules.forEach(module => {
            module.create();
        });
    }
}