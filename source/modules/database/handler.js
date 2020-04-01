import { AkairoHandler } from 'discord-akairo';
import DatabaseModule from './index';
import Constants from 'constants'
import DatabaseProvider from './models/provider';
import FirestoreDatabaseProvider from './providers/firestore';

export default class DatabaseHandler extends AkairoHandler {

    provider: DatabaseProvider = new FirestoreDatabaseProvider();

    constructor(client, {
        directory,
        classToHandle = DatabaseModule,
        loadFilter,
        automateCategories,
    }) {
        if (!(classToHandle.prototype instanceof DatabaseModule || classToHandle === DatabaseModule)) {
            throw new AkairoError('INVALID_CLASS_TO_HANDLE', options.classToHandle.name, DatabaseModule.name);
        }

        super(client, {
            directory,
            classToHandle,
            loadFilter,
            automateCategories,
        });
    }
}

