import { Duration } from 'luxon';

export default class TutelaryMeeting {
    id: string;
    name: string;
    source: string;
    location: string;
    locationDescription: string;
    formats: Array<string>;
    start: string;
    duration: string;
    timezone: string;
    weekday: int;
}