import { getRepository } from 'fireorm';
import { omitBy, isUndefined } from 'lodash';
import TutelaryServer from 'models/server';

export const ServerRepository = getRepository(TutelaryServer);

export const createOrUpdateServer = async (client, { id, name, joinedTimestamp, ownerID, region }) => {
    const server = new TutelaryServer();
    server.id = id;
    server.name = name;
    server.since = joinedTimestamp;
    server.owners = ownerID;
    server.region = region;

    const exists = await ServerRepository.findById(id);
    if (!exists) {
        client.logger.info(`Creating database for server ${name} (${id}).`);
        await ServerRepository.create(server);
    } else {
        client.logger.info(`Updating database for server ${name} (${id}).`);
        await ServerRepository.update(omitBy(server, isUndefined));
    }
}