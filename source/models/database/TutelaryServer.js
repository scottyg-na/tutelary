import { Collection, Type } from 'fireorm';
import MeetingReminderCronSettings from 'models/MeetingReminderCronSettings';
import JustForTodayCronSettings from 'models/JustForTodayCronSettings';

@Collection()
export default class TutelaryServer {
    id: string;
    name: string;
    since: Date;
    owners: Array | String;
    region: String;
    timezone: String = 'GMT';
    MeetingReminderCron: Object;
    JustForTodayCron: Object;
}