import { Command } from 'discord-akairo';
import { getRepository } from 'fireorm';
import DatabaseModule from 'modules/database';
import TutelaryMeeting from './models/meeting';

export default class MeetingsDatabaseModule extends DatabaseModule {

    instance: any = getRepository(TutelaryMeeting);

    constructor() {
        super('plugins:meetings:db:meetings', {});
    }

    onReady() {

    }

}