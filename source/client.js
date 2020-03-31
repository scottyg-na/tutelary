import { AkairoClient, CommandHandler, InhibitorHandler, ListenerHandler } from 'discord-akairo';
import { Collection, Message, StringResolvable } from 'discord.js';
import CronHandler from 'modules/cron/handler';
import Logger from 'util/logger';
import TutelaryError from 'models/error';
import path from 'path';
import DatabaseHandler from './modules/database/handler';

export default class TutelaryClient extends AkairoClient {

    Error: TutelaryError = TutelaryError;
    db: any;
    logger: Logger = new Logger().logger
    config: Object = {};
    handlers: Object = {
        db: new DatabaseHandler(this, {
            automateCategories: true,
            directory: __dirname,
            loadFilter: (path) => TutelaryClient.filterFilesForType('db', path, this),
        }),
        command: new CommandHandler(this, {
            allowMention: true,
            automateCategories: false,
            commandUtil: true,
            blockBots: true,
            blockClient: true,
            prefix: ['?', 'tute '],
            directory: __dirname,
            loadFilter: (path) => TutelaryClient.filterFilesForType('commands', path, this),
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
            directory: __dirname,
            loadFilter: (path) => TutelaryClient.filterFilesForType('inhibitors', path, this),
        }),
        listener: new ListenerHandler(this, {
            automateCategories: true,
            directory: __dirname,
            loadFilter: (path) => TutelaryClient.filterFilesForType('listeners', path, this),
        }),
        cron: new CronHandler(this, {
            automateCategories: true,
            directory: __dirname,
            loadFilter: (path) => TutelaryClient.filterFilesForType('crons', path, this),
        })
    }

    constructor(config: Object = {}) {
        super({
            ownerID: config.owners || ''
        }, {
            messageCacheLifetime: 300,
            messageCacheMaxSize: 35
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

        this.handlers.db.loadAll();
        this.handlers.command.loadAll();
        this.handlers.listener.loadAll();
        this.handlers.inhibitor.loadAll();
        this.handlers.cron.loadAll();

        return this;
    }

    start() {
        try {
         const force = ['-f', '--force'].some(f => process.argv.includes(f));
         return this.login(this.config.token);
        } catch(e) {
            console.log('err', e);
        }
    }

    static filterFilesForType(type: String, filename: String, client: TutelaryClient) {
        const match = (
            filename.includes(`/${type}/`) || filename.includes(`\\${type}\\`)
        );

        if (match)
            client.logger.info(`Loading '${filename}' in ${type}.`);

        return match;
    }

}