import { Command } from 'discord-akairo';
import { getForToday, getEmbeddedMessage } from 'util/just-for-today';

export default class JustForTodayCommand extends Command {
    constructor() {
        super('jft', {
            aliases: ['jft', 'just-for-today'],
            description: {
                content: 'Sends you todays Just For Today reading.',
            },
            typing: true,
            cooldown: 5000,
            ratelimit: 1,
        });
    }

    exec(message) {
        const response = getEmbeddedMessage(getForToday());
        return message.channel.send(response);
    }
}