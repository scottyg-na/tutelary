import { AkairoModule, AkairoError } from 'discord-akairo';
import { omitBy, isUndefined } from 'lodash';
import Constants from 'constants';
import DatabaseOptions from './models/options';
import asyncForEach from 'util/loops/asyncForEach'

export default class DatabaseModule extends AkairoModule {

    db: any;
    instance: any;
    options: DatabaseOptions = new DatabaseOptions();

    constructor(id, options: DatabaseOptions) {
        super(`Db:${id}`, options);
        this.options = options;
    }

    createOrUpdate(data: any) {}

    async deleteBatch(data: Array<any>) {
        if (data.length > 0) {
            const batch = this.instance.createBatch();

            await asyncForEach(data, async (id) => {
                this.client.logger.info(`Deleting database entry ${this.repository.collectionPath}/${id}`);
                await batch.delete(item);
            });

            return await batch.commit();
        }
    }

    async createOrUpdateBatch(data: Array<any>, filter: Function) {
        if (data.length > 0) {
            const batch = this.instance.createBatch();

            await asyncForEach(data, async (item) => {
                const exists = (item.id) ? await this.instance.findById(item.id) : false;
                if (!exists) {
                    await batch.create(item);
                } else {
                    await batch.update(omitBy(item, isUndefined));
                }
            });

            return await batch.commit();
        }
    }
}