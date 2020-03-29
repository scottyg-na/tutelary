import 'regenerator-runtime/runtime';
import dotenv from 'dotenv';
import TutelaryClient from './client';

dotenv.config();

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