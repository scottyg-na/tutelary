import { AkairoHandler } from 'discord-akairo';
import Cron from './index';
import Constants from 'constants'

export default class CronHandler extends AkairoHandler {

    constructor(client, {
        directory,
        classToHandle = Cron,
        loadFilter,
        automateCategories,
    }) {
        if (!(classToHandle.prototype instanceof Cron || classToHandle === Cron)) {
            throw new AkairoError('INVALID_CLASS_TO_HANDLE', options.classToHandle.name, Cron.name);
        }

        super(client, {
            directory,
            classToHandle,
            loadFilter,
            automateCategories,
        });
    }
}

