import { AkairoModule, AkairoError } from 'discord-akairo';
import { CronJob } from 'cron';
import Constants from 'constants';
import CronOptions from 'modules/cron/models/options';

export default class Cron extends AkairoModule {

    task: CronJob;
    options: CronOptions = new CronOptions();

    constructor(id, options: CronOptions) {
        super(id, options);
        this.options = options;
    }

    create() {
        try {

            if (typeof this.init === 'function') this.init();

            this.task = new CronJob(
                this.options.time,
                () => this.exec(),
                () => { },
                this.options.runOnInit,
                process.env.BOT_TIMEZONE,
            );

            this.handler.emit(
                Constants.Events.CRON_CREATED,
                this.options.name,
                this.id,
                this.options.time
            );

        } catch (e) {
            this.client.logger.error(e);
        }
    }

    exec() {
        throw new AkairoError('Not implemented!');
    }

    start() {
        throw new AkairoError('Not implemented!');
    }

    stop() {
        throw new AkairoError('Not implemented!');
    }

    destroy() {
        throw new AkairoError('Not implemented!');
    }

}