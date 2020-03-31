import { Listener } from 'discord-akairo';

export default class ClientReadyListener extends Listener {
    constructor() {
        super('client:ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    exec() {
        this.client.logger.info('Client ready...');
    }
}