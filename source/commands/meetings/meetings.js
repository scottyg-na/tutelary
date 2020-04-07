import chrono from 'chrono-node';
import { Command, Message } from 'discord-akairo';
import { DateTime, Duration } from 'luxon';
import { getFields } from 'util/meetings';
import Constants from 'constants';

export default class MeetingsCommand extends Command {
  constructor() {
    super('meetings', {
      aliases: ['meetings', 'meeting', 'meet'],
      channel: 'text',
      description: {
        content: 'View ',
        usage: '[date]',
        examples: ['', 'today', 'tomorrow', 'sunday', '24/2/2021', 'next friday'],
      },
      typing: true,
      cooldown: 5000,
      ratelimit: 1,
      args: [
        {
          id: 'searchDate',
          match: 'rest',
        },
      ],
    });
  }

  before(message: Message) {
    this.settingsDb = this.client.db.ServerSettings;
    this.meetingsDb = this.client.db.Meeting;
  }

  async exec(message: Message, { searchDate }: args) {
    try {
      const timezone = (await this.settingsDb.getSettingForServer(message.guild.id, 'timezone')) || 'GMT';
      const source = (await this.settingsDb.getSettingForServer(message.guild.id, 'meeting.source')) || null;
      const match = Object.entries(Constants.Meetings.NaOnlineSources).find(([key, value]) => value.name === source);
      const date = DateTime.local().setZone(timezone);
      if (match) {
        const [,s] = match;
        const meetings = await this.meetingsDb.getForDate(s.sources, date);

        return message.channel.send(
          this.client.dialog(`Online Meetings for ${date.toLocaleString(DateTime.DATE_HUGE)}`)
            .addFields(getFields(meetings, date))
        );
      } else {

      }
    } catch(e) {
      console.log(e);
    }
  }
}
