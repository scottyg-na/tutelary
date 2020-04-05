import { AkairoModule, AkairoError, AkairoClient } from 'discord-akairo';
import { Model } from 'sequelize-typescript';
import { isEqual, omitBy, isUndefined } from 'lodash';
import Constants from 'constants';
import DatabaseService from 'services/database';

export default class ServerDatabaseService extends DatabaseService {

    bulkFindOrCreate(servers: Array) {
        const serversArray = Array.isArray(servers)
            ? servers.map(server => this.mapGuild(server))
            : Array.from(servers).map(([id, server]) => this.mapGuild(server));

        return super.bulkFindOrCreate(serversArray);
    }

    mapGuild(guild) {
        return {
            id: guild.id,
            name: guild.name,
            since: guild.joinedTimestamp,
            owners: [guild.ownerID],
            region: guild.region
        }
    }
}