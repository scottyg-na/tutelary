import { Command } from 'discord-akairo';
import { getRepository } from 'fireorm';
import DatabaseModule from 'modules/database';
import TutelaryServer from './models/server';
import { Message } from 'firebase-functions/lib/providers/pubsub';

export default class ServerDatabaseModule extends DatabaseModule {

    instance: any = getRepository(TutelaryServer);

    constructor() {
        super('Server', {});
    }

    onReady() {
        const servers = [];
        Array.from(this.client.guilds.cache).forEach(async ([id, { name, joinedTimestamp, ownerID, region }]) => {
            try {
                const server = new TutelaryServer();
                server.id = id;
                server.name = name;
                server.since = joinedTimestamp;
                server.owners = ownerID;
                server.region = region;

                servers.push(server);
            } catch (e) {
                this.client.logger.warn(e.message);
            }
        });

        this.createOrUpdateBatch(servers);
    }

    async getServer(serverId) {
        try {
            const server = await this.instance.findById(serverId);
            return server;
        } catch(e) {
            this.client.logger.warn(`Unable to find server with ID ${serverId}`);
        }
    }

    async getTimezoneFromMessage(message: Message) {
        let timezone = process.env.TZ;
        try {
            if (message.channel.type === 'text') {
                const server = await this.getServer(message.channel.guild.id);
                timezone = server.timezone || process.env.TZ;

            }
        } catch(e) {
            console.log(e);
        }

        return timezone;
    }
}