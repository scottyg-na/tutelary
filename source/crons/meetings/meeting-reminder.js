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
            const start = utc.plus({ minutes: offset });

            [30, 10, 0].forEach(time => {
              const reminder = utc.plus({ minutes: offset }).minus({ minutes: time });

              if (reminder > date) {
                const job = new CronOptions();
                job.id = `${Constants.Modules.CRON_MEETING_REMINDER}-${id}-${time}min-${m.id}`;
                job.cronTime = reminder.toJSDate();
                // job.cronTime = date.plus({ seconds: 5 }).toJSDate();
                job.onTick = async () => await this.exec(server.id, job.id, m, start, time, settings.meeting.remindersChannel);
                job.onComplete = async () => await this.destroy(job.id);
                job.start = true;
                job.timezone = timezone;
                job.context = null;
                job.runOnInit = false;

                this.add(job);
              }
            });
          });
        } else {

        }
      }
    });
  }

  async exec(serverId, jobId, meeting, start, startsIn, channel) {
    super.exec(jobId);
    try {
      await new Promise((resolve, reject) => {
        (function waitForCache() {
          if (this.client.channels.cache.size > 0) return resolve();
          setTimeout(() => waitForCache.call(this), 10);
        }).call(this);
      });

      const reminderChannel = this.client.util.resolveChannel(channel, this.client.channels.cache);

      if (reminderChannel) {
        const reminderChannelIcon = reminderChannel.guild.iconURL({ format: 'webp', size: 16 });

        reminderChannel.send(
          `@here A meeting is starting ${startsIn === 0 ? 'now' : 'in ' + startsIn + ' minutes'}!`,
          this.client.dialog('')
            .setAuthor(meeting.name, reminderChannelIcon, meeting.location)
            .setDescription([
              'Feel free to head on over to the meeting now by [clicking here](' + meeting.location + ').'
            ])
            .addField('DESCRIPTION', !isEmpty(meeting.locationDescription) ? meeting.locationDescription : 'No Description')
            .addField('DURATION', meeting.duration, true)
            .addField('FORMAT', meeting.formats.join(', '), true)
          );
      }
    } catch (e) {
      this.client.logger.error(e.message);
    }
  }
}
