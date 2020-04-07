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

      this.handler.emit(
        Constants.Events.CRON_CREATED,
        id,
        cronTime,
      );

      this.jobs.push({
        id,
        job: new CronJob(
          cronTime,
          async () => {
            (typeof onTick === 'function')
              await onTick()

            this.handler.emit(
              Constants.Events.CRON_FINISHED,
              id,
            );
          },
          onComplete,
          start,
          timezone,
          context,
          runOnInit,
        ),
      });
    }

    exec(id) {
      this.handler.emit(
        Constants.Events.CRON_RUNNING,
        id,
      );
    }

    start(id) {
      this.get(id).job.start();
      this.handler.emit(
        Constants.Events.CRON_STARTED,
        id,
      );
    }

    stop(id) {
      this.get(id).job.stop();
      this.handler.emit(
        Constants.Events.CRON_STOPPED,
        id,
      );
    }

    remove(id) {
      remove(this.jobs, (job) => job.id === id);
      this.handler.emit(
        Constants.Events.CRON_REMOVED,
        id,
      );
    }

    destroy(id) {
      this.stop(id);
      this.remove(id);
    }

    destroyAll() {
      this.jobs.forEach(job => this.destroy(job.id));
    }

}
