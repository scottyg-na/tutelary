import { Listener } from 'discord-akairo';
import TutelaryServer from 'models/database/TutelaryServer';
import TutelaryServerSettings from 'models/database/TutelaryServerSettings';

export default class ClientReadyListener extends Listener {
    constructor() {
        super('client:ready', {
            emitter: 'client',
            event: 'ready'
        });
    }

    async exec() {
        const bot = this.client.user;
        const guilds = this.client.guilds.cache.size;

        this.client.logger.info(`Logged in as ${bot.tag} (ID: ${bot.id})`);
        bot.setActivity(`@${bot.username} help`, { type: 'LISTENING' });

        if (guilds) {
            this.client.logger.info(`Listening to ${guilds === 1
                ? this.client.guilds.cache.first()
                : `${guilds} Guilds`}`);
        } else {
            this.client.logger.info('Standby Mode');
        }

        // Populate our servers, if we haven't already.
        Array.from(this.client.guilds.cache).forEach(async ([id, guild]) => {
            const server = await this.client.getServer(guild.id);
            if (!server) {
                this.client.createServer(guild);
            }
            if (!server.settings) {
                this.client.createServerSettings(guild);
            }
        });

        return true;

    }
}