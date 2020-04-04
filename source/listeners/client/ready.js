import { Listener } from 'discord-akairo';

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

        return true;

    }
}