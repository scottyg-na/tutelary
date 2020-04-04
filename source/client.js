import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, SequelizeProvider } from 'discord-akairo';
import { Collection, Message, StringResolvable } from 'discord.js';
import TutelaryError from 'models/TutelaryError';
import Logger from 'util/logger';
import CronHandler from 'modules/cron/handler';
import { create } from 'database';
import DatabaseService from 'services/database';
import TutelaryServer from 'models/database/TutelaryServer';

const db = create();

export default class TutelaryClient extends AkairoClient {

    Error: TutelaryError = TutelaryError;

    db: any = db;
    logger: Logger = new Logger().logger;
    config: Object = {};
    handlers: Object = {
        command: new CommandHandler(this, {
            allowMention: true,
            automateCategories: false,
            commandUtil: true,
            blockBots: true,
            blockClient: true,
            prefix: ['?', 'tute '],
            directory: __dirname + '/commands',
            argumentDefaults: {
                prompt: {
                    cancel: (msg: Message) => `${msg.author}, command cancelled.`,
                    ended: (msg: Message) => `${msg.author}, command declined.`,
                    modifyRetry: (msg, text) => text && `${msg.author}, ${text}\n\nType \`cancel\` to cancel this command.`,
                    modifyStart: (msg, text) => text && `${msg.author}, ${text}\n\nType \`cancel\` to cancel this command.`,
                    retries: 3,
                    time: 30000,
                    timeout: (msg: Message) => `${msg.author}, command expired.`
                }
            }
        }),
        inhibitor: new InhibitorHandler(this, {
            automateCategories: true,
            directory: __dirname + '/inhibitors'
        }),
        listener: new ListenerHandler(this, {
            automateCategories: true,
            directory: __dirname + '/listeners'
        }),
        cron: new CronHandler(this, {
            automateCategories: true,
            directory: __dirname + '/crons'
        })
    }

    constructor(config: Object = {}) {
        super({
            ownerID: config.owners || ''
        }, {
            messageCacheLifetime: 300,
            messageCacheMaxSize: 35,
            disabledEvents: [
                'TYPING_START',
                'CHANNEL_PINS_UPDATE',
                'GUILD_BAN_ADD',
                'GUILD_BAN_REMOVE',
                'MESSAGE_DELETE',
                'MESSAGE_DELETE_BULK',
                'RESUMED',
                'WEBHOOKS_UPDATE',
            ],
            disableEveryone: true,
        });

        this.config = config;
    }

    build() {
        this.handlers.command
            .useInhibitorHandler(this.handlers.inhibitor)
            .useListenerHandler(this.handlers.listener);

        this.handlers.listener
            .setEmitters({
                command: this.handlers.command,
                inhibitor: this.handlers.inhibitor,
                listener: this.handlers.listener,
                cron: this.handlers.cron,
                process,
            });

        this.handlers.command.loadAll();
        this.handlers.listener.loadAll();
        this.handlers.inhibitor.loadAll();
        this.handlers.cron.loadAll();

        return this;
    }

    async start() {
        try {
            const force = ['-f', '--force'].some(f => process.argv.includes(f));
            await this.db.sequelize.sync({ force });

            return this.login(this.config.token);
        } catch (e) {
            console.log('err', e);
        }
    }

    async getServer(guildId) {
        const { dataValues: server } = await this.db.Server.findByPk(guildId, {
            include: [ this.db.ServerSettings ]
        });
        return server;
    }

    async createServer(guild) {
        try {
            this.logger.info(`Adding connected server ${guild.name}#${guild.id} to database`);
            await this.db.Server.create({
                id: guild.id,
                name: guild.name,
                since: guild.joinedTimestamp,
                owners: [guild.ownerID],
                region: guild.region
            });
        } catch (e) {
            this.logger.error(e);
        }
    }

    async getServerSettings(guildId, setting) {
        const server = await this.getServer(guildId);
        return server.settings.get(setting);
    }

    async createServerSettings(guild) {
        try {
            this.logger.info(`Adding connected server settings for ${guild.name}#${guild.id} to database`);
            await this.db.ServerSettings.create({
                id: guild.id
            });
        } catch(e) {
            this.logger.error(e);
        }
    }

}