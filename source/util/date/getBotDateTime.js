import { DateTime } from 'luxon';

export default (date: DateTime = DateTime.local()) => {
    console.log(date);
    return date.setZone(process.env.BOT_TIMEZONE);
}