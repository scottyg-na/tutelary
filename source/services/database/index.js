import { Model } from 'sequelize-typescript';

export default class DatabaseService {
    provider: T;
    db: Model;

    constructor(provider: T, model: Model) {
      this.provider = provider;
      this.db = provider.getRepository(model);
    }

    async bulkFindOrCreate(records: Array) {
      const actions = [];
      records.forEach((record) => {
        actions.push(this.findCreateFind({
          where: { id: record.id },
          defaults: record,
        }));
      });

      return Promise.all(actions);
    }

    build = (...args) => this.db.build(...args);
    bulkCreate = (...args) => this.db.bulkCreate(...args);
    create = (...args) => this.db.create(...args);
    find = (...args) => this.db.find(...args);
    findAll = (...args) => this.db.findAll(...args);
    findAndCountAll = (...args) => this.db.findAndCountAll(...args);
    findById = (...args) => this.db.findByPk(...args);
    findCreateFind = (...args) => this.db.findCreateFind(...args);
    findOne = (...args) => this.db.findOne(...args);
    findOrBuild = (...args) => this.db.findOrBuild(...args);
    findOrCreate = (...args) => this.db.findCreateFind(...args);
    getTableName = (...args) => this.db.getTableName(...args);
    increment = (...args) => this.db.increment(...args);
    max = (...args) => this.db.max(...args);
    min = (...args) => this.db.min(...args);
    truncate = (...args) => this.db.truncate(...args);
    update = (...args) => this.db.update(...args);
    upsert = (...args) => this.db.upsert(...args);
}
