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

        // Load all onReady methods in modules.
        Object.entries(this.client.handlers).forEach(([id, handler]) => {
            Array.from(handler.modules).forEach(([key, module]) => {
                if (typeof module.onReady === 'function')
                    module.onReady();
            });
        });
    }
}