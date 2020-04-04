import NodeCache from 'node-cache';

export default class TutelaryCache {

    cache: NodeCache;

    constructor(options) {
        this.cache = new NodeCache(Object.assign({}, {
            stdTTL: 60 * 60 * 1,
            checkPeriod: (60 * 60 * 1) * 0.2,
            useClones: false,
        }));
    }

    get(key, storeFunction) {
        const value = this.cache.get(key);
        if (value) {
            return Promise.resolve(value);
        }

        return storeFunction().then((result) => {
            this.cache.set(key, result);
            return result;
        });
    }

    create(key, storeFunction) {
        return storeFunction().then((result) => {
            this.cache.set(key, result);
            return result;
        });
    }

    update(key, storeFunction) {
        return storeFunction().then((result) => {
            this.cache.del(key);
            this.cache.set(key, result);
            return result;
        });
    }

    del(keys) {
        this.cache.del(keys);
    }

    delStartWith(startStr = '') {
        if (!startStr) {
            return;
        }

        const keys = this.cache.keys();
        for (const key of keys) {
            if (key.indexOf(startStr) === 0) {
                this.del(key);
            }
        }
    }

    flush() {
        this.cache.flushAll();
    }
}