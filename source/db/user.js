import { Command } from 'discord-akairo';
import { getRepository } from 'fireorm';
import DatabaseModule from 'modules/database';
import TutelaryServer from './models/server';

export default class ServerDatabaseModule extends DatabaseModule {

    instance: any = getRepository(TutelaryServer);

    constructor() {
        super('db:user', {});
    }

    onReady() {
        // console.log(this.client)
        // const servers = [];
        // Array.from(this.client.guilds.cache).forEach(async ([id, { name, joinedTimestamp, ownerID, region }]) => {
        //     try {
        //         const server = new TutelaryServer();
        //         server.id = id;
        //         server.name = name;
        //         server.since = joinedTimestamp;
        //         server.owners = ownerID;
        //         server.region = region;
        //         servers.push(server);
        //     } catch (e) {
        //         this.client.logger.warn(e.message);
        //     }
        // });

        // this.createOrUpdateBatch(servers);
    }

}

// export const ServerRepository = ;

// export const createOrUpdateServer = async (client, { id, name, joinedTimestamp, ownerID, region }) => {
//     const server = new TutelaryServer();
//     server.id = id;
//     server.name = name;
//     server.since = joinedTimestamp;
//     server.owners = ownerID;
//     server.region = region;

//     const exists = await ServerRepository.findById(id);
//     if (!exists) {
//         client.logger.info(`Creating database for server ${name} (${id}).`);
//         await ServerRepository.create(server);
//     } else {
//         client.logger.info(`Updating database for server ${name} (${id}).`);
//         await ServerRepository.update(omitBy(server, isUndefined));
//     }
// }


// Create our server config if it doesn't already exist.
// Array.from(this.client.guilds.cache).forEach(async ([id, guild]) => {
//     try {
//         await createOrUpdateServer(this.client, guild);
//     } catch (e) {
//         this.client.logger.warn(e.message);
//     }
// });