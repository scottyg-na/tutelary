import { Model } from 'sequelize-typescript';
import { validateOrReject } from 'class-validator';

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

    async validate(value: T) {
      await validateOrReject(value);
    }

    build = async (...args) => this.db.build(...args);
    bulkCreate = async (...args) => this.db.bulkCreate(...args);
    create = async (...args) => this.db.create(...args);
    find = async (...args) => this.db.find(...args);
    findAll = async (...args) => this.db.findAll(...args);
    findAndCountAll = async (...args) => this.db.findAndCountAll(...args);
    findById = async (...args) => this.db.findByPk(...args);
    findCreateFind = async (...args) => this.db.findCreateFind(...args);
    findOne = async (...args) => this.db.findOne(...args);
    findOrBuild = async (...args) => this.db.findOrBuild(...args);
    findOrCreate = async (...args) => this.db.findCreateFind(...args);
    getTableName = async (...args) => this.db.getTableName(...args);
    increment = async (...args) => this.db.increment(...args);
    max = async (...args) => this.db.max(...args);
    min = async (...args) => this.db.min(...args);
    truncate = async (...args) => this.db.truncate(...args);
    update = async (...args) => this.db.update(...args);
    upsert = async (...args) => this.db.upsert(...args);
}
