import { AkairoModule, AkairoError, AkairoClient } from 'discord-akairo';
import { Model } from 'sequelize-typescript';
import { isEqual, omitBy, isUndefined } from 'lodash';
import Constants from 'constants';
import DatabaseService from 'services/database';
import { Guild } from 'discord.js';

export default class ServerSettingsDatabaseService extends DatabaseService {

    bulkFindOrCreate(servers: Array) {
        const serversArray = Array.isArray(servers)
            ? servers.map(server => this.mapGuild(server))
            : Array.from(servers).map(([id, server]) => this.mapGuild(server));

        return super.bulkFindOrCreate(serversArray);
    }

    mapGuild(guild) {
        return {
            id: guild.id
        }
    }
}