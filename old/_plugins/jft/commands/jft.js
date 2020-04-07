import { Command } from 'discord-akairo';
import { DateTime } from 'luxon';
import { getForDate, getEmbeddedMessage } from '../util';

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

    ready() {
        this.db = this.client.db.ServerSettings;
    }

    async exec(message: Message) {
        let date = DateTime.local();
        const timezone = this.db.getSettingForServer(message.guild.id, 'timezone');
        console.log(timezone);
        // date = date.setZone(timezone);

        const response = getEmbeddedMessage(getForDate(date));
        return message.channel.send(response);
    }
}