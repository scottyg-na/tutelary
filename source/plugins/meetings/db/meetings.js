import { Command } from 'discord-akairo';
import { getRepository } from 'fireorm';
import DatabaseModule from 'modules/database';
import TutelaryMeeting from './models/meeting';
import getBotDateTime from 'util/date/getBotDateTime';

export default class MeetingsDatabaseModule extends DatabaseModule {

    instance: any = getRepository(TutelaryMeeting);

    constructor() {
        super('plugins:meetings:db:meetings', {});
    }

    onReady() {

    }

    async getMeetingsForDate(date: DateTime = getBotDateTime()) {
        console.log(date);
        return await this.instance
            .whereEqualTo('weekday', date.weekday)
            .find();
    }

}