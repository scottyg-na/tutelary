const { Command } = require('discord-akairo');

export default class PingCommand extends Command {
    constructor() {
        super('ping', {
            aliases: ['ping'],
            description: {
                content: 'A useless command :)',
            },
            typing: true,
            cooldown: 50000,
            ratelimit: 1,
        });
    }

    exec(message) {
        return message.reply('Pong!');
    }
}