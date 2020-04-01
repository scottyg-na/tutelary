import { Listener } from 'discord-akairo';

export default class CommandStartedListener extends Listener {
    constructor() {
        super('db:command:before', {
            emitter: 'command',
            event: 'commandStarted'
        });
    }

    exec(message, command) {
        // const userRepository = this.client.handlers.db.modules.get('db:user').repository;
        // console.log(message);
    }
}