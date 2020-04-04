import { AkairoModule, AkairoError, AkairoClient } from 'discord-akairo';
import { isEqual, omitBy, isUndefined } from 'lodash';
import Constants from 'constants';
import DatabaseOptions from 'models/DatabaseOptions';
import TutelaryCache from 'services/cache';

export default class DatabaseService {

    _client: AkairoClient;
    _repository: any;
    _cache: TutelaryCache = new TutelaryCache();
    options: DatabaseOptions = new DatabaseOptions();

    constructor(id, options: DatabaseOptions) {
        this.options = options;
    }

    get client() {
        return this._client;
    }

    set client(client: AkairoClient) {
        this._client = client;
    }

    static getId(id: String) {
        return id.split(':')[1];
    }
}