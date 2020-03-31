import { AkairoModule, AkairoError } from 'discord-akairo';
import Constants from 'constants';
import DatabaseOptions from './models/options';

export default class DatabaseModule extends AkairoModule {

    repository: any;
    options: DatabaseOptions = new DatabaseOptions();

    constructor(id, options: DatabaseOptions) {
        super(id, options);
        this.options = options;
    }

    init = () => {}
}