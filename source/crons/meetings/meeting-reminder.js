import { Command } from 'discord-akairo';
import CronModule from 'modules/cron';
import CronOptions from 'models/CronOptions';
import { getMeetingsFromVirtualNA } from 'util/meetings';
import Constants from 'constants';
import TutelaryClient from 'client';
import { isEmpty } from 'lodash';
import { DateTime } from 'luxon';

export default class MeetingReminderCron extends CronModule {
  constructor() {
    super(Constants.Modules.CRON_MEETING_REMINDER, {});
  }

  async load(client: TutelaryClient) {
    const servers = await client.db.Server.findAll({
      include: [client.db.sequelize.models.TutelaryServerSettings]
    });

    servers.forEach(async (server) => {
      const { id, settings } = server.get('settings').get();
      if (
        settings.meeting.reminders &&
        !isEmpty(settings.meeting.remindersChannel) &&
        !isEmpty(settings.meeting.source)
      ) {
        const timezone = settings.timezone;
        const sources = settings.meeting.source;
        const match = Object.entries(Constants.Meetings.NaOnlineSources).find(([key, value]) => value.name === sources);
        const date = DateTime.local().setZone(timezone);

        if (match) {
          const [, s] = match;
          const meetings = await client.db.Meeting.getForDate(s.sources, date);

          meetings.forEach(meeting => {
            const m = meeting.get();
            const { offset } = date;

            const [sh, sm] = m.start.split(':').map((t) => parseInt(t, 10));
            const utc = date.set({ hour: sh, minute: sm });
            const start = utc.plus({ minutes: offset }).minus({ minutes: 10 });

            if (start > date) {
              const job = new CronOptions();
              job.id = `${Constants.Modules.CRON_MEETING_REMINDER}-${id}-${m.id}`;
              job.cronTime = start.toJSDate();
              job.onTick = () => this.exec(server.id, job.id, m, start, settings.meeting.remindersChannel);
              job.onComplete = () => { };
              job.start = true;
              job.timezone = settings.timezone;
              job.context = null;
              job.runOnInit = false;

              this.add(job);
            }
          });
        } else {

        }
      }
    });
  }

  async exec(serverId, jobId, meeting, date, channel) {
    super.exec(jobId);
    try {
      await new Promise((resolve, reject) => {
        (function waitForCache() {
          if (this.client.channels.cache.size > 0) return resolve();
          setTimeout(() => waitForCache.call(this), 10);
        }).call(this);
      });

      const match = this.client.util.resolveChannel(channel, this.client.channels.cache);
      if (match) {
        match.send(
          this.client.dialog(`Meeting starting in 10 minutes!`)
            .setDescription([
              `**${meeting.name}**`,
              'You can [click here to join](' + meeting.location + ') the meeting voice chat now.'
            ])
            .addField('DESCRIPTION', !isEmpty(meeting.locationDescription) ? meeting.locationDescription : 'No Description')
            .addField('DURATION', meeting.duration)
            .addField('FORMAT', meeting.formats.join(','))
        );
      }
    } catch (e) {
      this.client.logger.error(e.message);
    }
  }
}
