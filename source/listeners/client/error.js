const { Listener } = require('discord-akairo');

export default class ClientErrorListener extends Listener {
    constructor() {
        super('client:error', {
            emitter: 'client',
            event: 'error'
        });
    }

    exec(error) {
        this.client.logger.error(error);
    }
}