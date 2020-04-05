import { AkairoModule } from 'discord-akairo';
import { CronJob } from 'cron';
import { remove } from 'lodash';
import Constants from 'constants';
import CronOptions from 'models/CronOptions';

export default class CronModule extends AkairoModule {
    jobs: Array<CronJob> = [];

    get(id) {
      return this.jobs.find((job) => job.id === id);
    }

    add({
      id, cronTime, onTick, onComplete, start, timezone, context, runOnInit,
    }: CronOptions) {
      this.jobs.push({
        id,
        job: new CronJob(
          cronTime,
          onTick,
          onComplete,
          start,
          timezone,
          context,
          runOnInit,
        ),
      });
    }

    ready() {
      try {
        this.handler.emit(
          Constants.Events.CRON_CREATED,
          this.options.name,
          this.id,
          this.options.time,
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

    exec(id) {
      this.client.logger.info(`Running cron ${id} from ${this.id}`);
    }

    start(id) {
      this.get(id).job.start();
    }

    stop(id) {
      this.get(id).job.stop();
    }

    remove(id) {
      remove(this.jobs, (job) => job.id === id);
    }

    destroy(id) {
      this.stop(id);
      this.remove(id);
    }
}
