import { Command } from 'discord-akairo';
import CronModule from 'modules/cron';
import { getForToday, getEmbeddedMessage } from '../util';
import CronOptions from 'modules/cron/models/options';
import { CronJob } from 'cron';

export default class JftAutomateCron extends CronModule {

    channels: string[] = [];

    constructor() {
        super('plugins:jft:cron:automate', new CronOptions({
            name: 'JFT - Automate',
            time: '0 0 7 * * *',
            runOnInit: false,
        }));
    }

    onReady() {
        super.onReady();
        this.channels = this.client.channels.cache.filter(channel => channel.type === 'text' && channel.name.includes('just-for-today-daily'));
    };

    exec() {
        const response = getEmbeddedMessage(getForToday());
        this.channels.forEach(channel => channel.send(response));
    }
}