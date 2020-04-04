import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import Meeting from 'models/database/TutelaryMeeting';

export const sequelize = new Sequelize({
    dialect: 'sqlite',
    database: 'tutelary',
    storage: '.data/tutelary.sqlite',
    define: {
        freezeTableName: true,
        timestamps: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
    },
    logging: false,
    modelPaths: [__dirname + '../models/database'],
    pool: {
        acquire: 30e3,
        max: 10,
        min: 0
    }
});

export const create = () => {
    return {
        sequelize,
        Op,
        Meeting,
    };
};