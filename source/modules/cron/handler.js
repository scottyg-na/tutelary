import { AkairoHandler } from 'discord-akairo';
import Cron from './index';
import Constants from 'constants'

export default class CronHandler extends AkairoHandler {

    constructor(client, options) {
        if (!(options.classToHandle.prototype instanceof Cron || options.classToHandle === Cron)) {
            throw new AkairoError('INVALID_CLASS_TO_HANDLE', options.classToHandle.name, Cron.name);
        }

        super(client, {
            directory: options.directory,
            classToHandle: Cron
        });
    }
}

