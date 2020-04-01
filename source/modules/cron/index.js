import { AkairoModule, AkairoError } from 'discord-akairo';
import { CronJob } from 'cron';
import Constants from 'constants';
import CronOptions from 'modules/cron/models/options';

export default class CronModule extends AkairoModule {

    task: CronJob;
    options: CronOptions = new CronOptions();

    constructor(id, options: CronOptions) {
        super(id, options);
        this.options = options;
    }

    onReady() {
        try {
            this.handler.emit(
                Constants.Events.CRON_CREATED,
                this.options.name,
                this.id,
                this.options.time
            );

            this.task = new CronJob(
                this.options.time,
                () => {
                    this.handler.emit(Constants.Events.CRON_STARTED, this.options.name, this.id);
                    this.exec();
                    this.handler.emit(Constants.Events.CRON_FINISHED, this.options.name, this.id);
                },
                () => { },
                true,
                process.env.BOT_TIMEZONE,
                this,
                this.options.runOnInit,
            );
        } catch (e) {
            this.client.logger.error(e);
        }
    }

    exec() {
        throw new AkairoError('Not implemented!');
    }

    start() {
        this.task.start();
    }

    stop() {
        this.task.stop();
    }

    destroy() {
        this.task.stop();
        delete this.task;
        this.handler.remove(this.id);
    }

}