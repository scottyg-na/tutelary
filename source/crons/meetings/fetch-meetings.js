import { Command } from 'discord-akairo';
import CronModule from 'modules/cron';
import CronOptions from 'models/CronOptions';
import { getMeetingsFromVirtualNA } from 'util/meetings';
import Constants from 'constants';
import TutelaryClient from 'client';

export default class FetchMeetingsCron extends CronModule {
  constructor() {
    super(Constants.Modules.CRON_FETCH_MEETINGS, {});
  }

  load(client: TutelaryClient) {
    const job = new CronOptions();
    job.id = `${Constants.Modules.CRON_FETCH_MEETINGS}-${Math.random().toString(36).slice(2)}`;
    job.cronTime = '0 0 */1 * * *';
    job.onTick = () => this.exec(job.id);
    job.onComplete = () => {};
    job.start = true;
    job.timezone = process.env.BOT_TIMEZONE;
    job.context = null;
    job.runOnInit = true;

    this.add(job);
  }

  async exec(id) {
    super.exec(id);

    try {
      const meetings = await getMeetingsFromVirtualNA();
      await this.client.db.Meeting.bulkCreate(meetings, {
        updateOnDuplicate: [
          'name',
          'source',
          'sourceService',
          'location',
          'locationDescription',
          'formats',
          'start',
          'duration',
          'timezone',
          'weekday',
        ],
      });
    } catch (e) {
      this.client.logger.error(e.message);
    }
  }
}
