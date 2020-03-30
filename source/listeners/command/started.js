import { Listener } from 'discord-akairo';

export default class CommandStartedListener extends Listener {
    constructor() {
        super('command:started', {
            emitter: 'command',
            event: 'commandStarted'
        });
    }

    exec(message, command) {
        this.client.logger.info(`[COMMAND] Command: ${command}, Channel: ${message.channel.name || 'DM'}, User: ${message.author.id}`);
    }
}