import { Command } from 'discord-akairo';
import CronModule from 'modules/cron';
import { getForDate, getEmbeddedMessage } from '../util';
import CronOptions from 'modules/cron/models/options';
import { CronJob } from 'cron';

export default class JftAutomateCron extends CronModule {

    channels: string[] = [];

    constructor() {
        super('JftAutomate', new CronOptions({
            name: 'JFT - Automate',
            time: '0 0 7 * * *',
            runOnInit: false,
        }));
    }

    onReady() {
        super.onReady();
        try {
            this.repository = this.client.getDb('Server');
            this.channels = this.client.channels.cache.filter(channel => channel.type === 'text' && channel.name.includes('just-for-today-daily'));
        } catch(e) {
            this.client.logger.warn('JftAutomateCron.onReady()');
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