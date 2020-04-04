import 'regenerator-runtime/runtime';
import dotenv from 'dotenv';
import TutelaryClient from './client';
import { DateTime, Settings as DateTimeSettings } from 'luxon';

dotenv.config();
process.env.TZ = process.env.BOT_TIMEZONE || 'GMT';
DateTimeSettings.defaultZoneName = process.env.TZ;

const config: Object = {
    name: 'Tutelary',
    version: '1.0.0',
    nickname: process.env.DISCORD_NICKNAME,
    token: process.env.DISCORD_TOKEN,
    owners: process.env.BOT_OWNERS
}

const Client = new TutelaryClient(config);

Client.build()
    .start()
    .catch(e => Client.logger.error(e));