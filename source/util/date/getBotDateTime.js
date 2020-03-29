import { DateTime } from 'luxon';

export default (date: DateTime = DateTime.local()) => {
    return date.setZone(process.env.BOT_TIMEZONE);
}