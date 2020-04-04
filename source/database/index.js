import path from 'path';
import fs from 'fs';
import { Op } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';
import TutelaryServer from 'models/database/TutelaryServer';
import TutelaryMeeting from 'models/database/TutelaryMeeting';
import TutelaryUser from 'models/database/TutelaryUser';
import TutelaryServerSettings from 'models/database/TutelaryServerSettings';

let first = false;
const databasePath = path.normalize(__dirname + '/../.data/');
const databaseName = 'tutelary.sqlite';

// Create our database files if this is our first load.
const isFirstRun = (() => {
    try {
        if (!fs.existsSync(databasePath)) {
            fs.mkdirSync(databasePath);
        }

        fs.writeFileSync(path.normalize(databasePath + databaseName), '', { flag: 'wx' });
        return true;
    } catch (e) {
        return false;
    }
})();


export const sequelize = new Sequelize({
    repositoryMode: true,
    dialect: 'sqlite',
    storage: path.normalize(databasePath + databaseName),
    define: {
        freezeTableName: true,
        timestamps: true,
        charset: 'utf8mb4',
        collate: 'utf8mb4_unicode_ci'
    },
    logging: false,
    models: [
        TutelaryServer,
        TutelaryServerSettings,
        TutelaryMeeting,
        TutelaryUser,
    ],
});

export const create = () => {
    return {
        sequelize,
        Op,
        Server: sequelize.getRepository(TutelaryServer),
        ServerSettings: sequelize.getRepository(TutelaryServerSettings),
        Meeting: sequelize.getRepository(TutelaryMeeting),
        User: sequelize.getRepository(TutelaryUser),
    };
};