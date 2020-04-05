import { DateTime } from 'luxon';

export const getBotDateTime = (date: DateTime = DateTime.local()) => date.setZone(process.env.BOT_TIMEZONE);
