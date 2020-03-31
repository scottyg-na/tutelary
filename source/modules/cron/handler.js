import { AkairoHandler } from 'discord-akairo';
import CronModule from './index';
import Constants from 'constants'

export default class CronHandler extends AkairoHandler {

    constructor(client, {
        directory,
        classToHandle = CronModule,
        loadFilter,
        automateCategories,
    }) {
        if (!(classToHandle.prototype instanceof CronModule || classToHandle === CronModule)) {
            throw new AkairoError('INVALID_CLASS_TO_HANDLE', options.classToHandle.name, CronModule.name);
        }

        super(client, {
            directory,
            classToHandle,
            loadFilter,
            automateCategories,
        });

        this.on('load', module => module.create());
    }
}

