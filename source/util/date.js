import { DateTime } from 'luxon';

export const getBotDateTime = (date: DateTime = DateTime.local()) => {
    return date.setZone(process.env.BOT_TIMEZONE);
}