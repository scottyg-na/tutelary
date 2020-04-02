import 'regenerator-runtime/runtime';
import dotenv from 'dotenv';
import TutelaryClient from './client';
import { DateTime, Settings as DateTimeSettings } from 'luxon';

dotenv.config();
DateTimeSettings.defaultZoneName = process.env.TZ || 'GMT';

const config: Object = {
    name: 'Tutelary',
    version: '1.0.0',
    nickname: process.env.DISCORD_NICKNAME,
    token: process.env.DISCORD_TOKEN,
    owners: process.env.BOT_OWNERS
}

new TutelaryClient(config)
    .build()
    .start();