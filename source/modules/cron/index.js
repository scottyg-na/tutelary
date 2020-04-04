import { AkairoModule, AkairoError } from 'discord-akairo';
import { CronJob } from 'cron';
import { remove } from 'lodash';
import Constants from 'constants';
import CronOptions from 'models/CronOptions';

export default class CronModule extends AkairoModule {

    jobs: Array<CronJob> = [];

    constructor(id, options: CronOptions) {
        super(id, options);
    }

    get(id) {
        return this.jobs.find(job => job.id === job);
    }

    add(job: CronJob) {
        this.jobs.push(job);
    }

    remove(id) {
        remove(this.jobs, (job) => job.id === id);
    }

    ready() {
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
                false,
            );

            if (this.options.runOnInit === true) {
                setTimeout(() => this.task.fireOnTick(), 2000);
            }
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