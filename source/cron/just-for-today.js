import { Command } from 'discord-akairo';
import Cron from 'modules/cron';
import { getForToday, getEmbeddedMessage } from 'util/just-for-today';
import CronOptions from '../models/cron-options';
import { CronJob } from 'cron';

export default class JustForTodayCron extends Cron {

    channels: string[] = [];

    constructor() {
        super('jft', new CronOptions({
            name: 'Just For Today',
            time: '0 0 7 * * *'
        }));
    }

    init() {
        this.channels = this.client.channels.cache.filter(channel => channel.type === 'text' && channel.name.includes('just-for-today-daily'));
    };

    exec() {
        const response = getEmbeddedMessage(getForToday());
        this.channels.forEach(channel => channel.send(response));
    }
}