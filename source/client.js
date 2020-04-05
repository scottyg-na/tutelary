import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler, SequelizeProvider } from 'discord-akairo';
import { Collection, Message, StringResolvable } from 'discord.js';
import TutelaryError from 'models/TutelaryError';
import Logger from 'util/logger';
import CronHandler from 'modules/cron/handler';
import { create } from 'database';
import TutelaryServer from 'models/database/TutelaryServer';

const db = create();

export default class TutelaryClient extends AkairoClient {

    Error: TutelaryError = TutelaryError;

    db: any = db;
    logger: Logger = new Logger().logger;
    config: Object = {};
    dialog: Function = (title: string, description: StringResolvable = '') => {
        return this.util.embed()
            .setColor(0xFE9257)
            .setTitle(title)
            .setDescription(description);
    };
    handlers: Object = {
        command: new CommandHandler(this, {
            allowMention: true,
            automateCategories: true,
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

    async getServerSettings(guildId, setting) {
        const server = await this.getServer(guildId);
        return server.settings.get(setting);
    }

}