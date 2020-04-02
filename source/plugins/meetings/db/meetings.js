import { Command } from 'discord-akairo';
import { getRepository } from 'fireorm';
import DatabaseModule from 'modules/database';
import TutelaryMeeting from './models/meeting';

export default class MeetingDatabaseModule extends DatabaseModule {

    instance: any = getRepository(TutelaryMeeting);

    constructor() {
        super('Meeting', {});
    }

    onReady() {

    }

    async getMeetingsForDate(date: DateTime = DateTime.local()) {
        return await this.instance
            .whereEqualTo('weekday', date.weekday)
            .find();
    }

}