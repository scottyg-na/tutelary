import { Command } from 'discord-akairo';
import CronModule from 'modules/cron';
import { getForDate, getEmbeddedMessage } from '../util';
import CronOptions from 'models/CronOptions';
import { CronJob } from 'cron';

export default class JftAutomateCron extends CronModule {

    channels: string[] = [];

    constructor() {
        super('JftAutomate', new CronOptions({
            name: 'JFT - Automate',
            time: '0 0 17 * * *',
            runOnInit: false,
        }));
    }

    ready() {
        super.ready();
        try {
            this.repository = this.client.db.Server;
            this.channels = this.client.channels.cache.filter(channel => channel.type === 'text' && channel.name.includes('just-for-today-daily'));
        } catch(e) {
            this.client.logger.warn('JftAutomateCron.ready()');
        }
    };

    async exec() {
        let date = DateTime.local();
        const timezone = await this.repository.getTimezoneFromMessage(message);
        date = date.setZone(timezone);

        const response = getEmbeddedMessage(getForDate(date));
        return this.channels.forEach(channel => channel.send(response));
    }
}