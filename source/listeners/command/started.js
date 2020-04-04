import { Listener } from 'discord-akairo';

export default class CommandStartedListener extends Listener {
    constructor() {
        super('command:started', {
            emitter: 'command',
            event: 'commandStarted'
        });
    }

    exec(message, command) {
        this.client.logger.info(`[Event: ${this.event}] ${message.author.tag} ran '${message.content}' in ${message.channel.name || 'DM'}`);
    }
}