import { AkairoModule, AkairoError, AkairoClient } from 'discord-akairo';
import { isEqual, omitBy, isUndefined } from 'lodash';
import Constants from 'constants';
import { IWherePropParam, IFirestoreVal } from 'fireorm';
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
        console.log(this.emit)
        this._client = client;
    }

    get collection() {
        return Object.entries(this._cache.cache.data).map(([meetingId, meetingCache]) => meetingCache.v);
    }

    async create(item: T) {
        const key = `${this.options.cacheKey}_${item.id}`;
        return await this._cache.create(key, async () => await this._repository.create(omitBy(item, isUndefined)));
    }

    async delete(id: String) {
        const key = `${this.options.cacheKey}_${id}`;
        const deleted = await this._repository.delete(id);
        this.cache.del(key);
        return true;
    }

    async findById(id: String) {
        const key = `${this.options.cacheKey}_${id}`;
        return await this._cache.get(key, async () => await this._repository.findById(id));
    }

    async update(item: T) {
        const key = `${this.options.cacheKey}_${item.id}`;
        return await this._cache.update(key, async () => await this._repository.update(omitBy(item, isUndefined)));

    }

    validate(item: T) {
        return this._repository.validate(item);
    }

    createBatch() {
        return this._repository.createBatch();
    }

    execute(...args) {
        return this._repository.execute(...args);
    }

    find() {
        return this._repository.find();
    }

    findOne() {
        return this._repository.findOne();
    }

    limit(limitValue: Number) {
        return this._repository.limit(limitValue);
    }

    orderByAscending(prop: IWherePropParam) {
        return this._repository.orderByAscending(prop);
    }

    orderByDescending(prop: IWherePropParam) {
        return this._repository.orderByDescending(prop);
    }

    runTransaction(executor: Function) {
        return this._repository.runTransaction(executor);
    }

    whereArrayContains(prop: IWherePropParam<T>, value: IFirestoreVal) {
        return this._repository.whereArrayContains(prop, value);
    }

    whereEqualTo(prop: IWherePropParam<T>, value: IFirestoreVal) {
        return this._repository.whereEqualTo(prop, value);
    }

    whereGreaterOrEqualThan(prop: IWherePropParam<T>, value: IFirestoreVal) {
        return this._repository.whereGreaterOrEqualThan(prop, value);
    }

    whereGreaterThan(prop: IWherePropParam<T>, value: IFirestoreVal) {
        return this._repository.whereGreaterThan(prop, value);
    }

    whereLessOrEqualThan(prop: IWherePropParam<T>, value: IFirestoreVal) {
        return this._repository.whereLessOrEqualThan(prop, value);
    }

    whereLessThan(prop: IWherePropParam<T>, value: IFirestoreVal) {
        return this._repository.whereLessThan(prop, value);
    }

    static getId(id: String) {
        return id.split(':')[1];
    }
}