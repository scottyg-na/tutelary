import { Command } from 'discord-akairo';
import { DateTime } from 'luxon';
import { getForDate, getEmbeddedMessage } from 'util/jft';

export default class JustForTodayCommand extends Command {
  constructor() {
    super('jft', {
      aliases: ['jft', 'just-for-today'],
      description: {
        content: 'Sends you todays Just For Today reading.',
      },
      typing: true,
      cooldown: 5000,
      ratelimit: 1,
    });
  }

  // before() {};
  // condition() {};

  async exec(message) {
    // let date = DateTime.local();
    // const timezone = await this.repository.getTimezoneFromMessage(message);
    // date = date.setZone(timezone);

    // const response = getEmbeddedMessage(getForDate(date));
    return message.channel.send('jft');
  }
}
