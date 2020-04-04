import { Command } from 'discord-akairo';
import CronModule from 'modules/cron';
import CronOptions from 'models/CronOptions';
import { CronJob } from 'cron';
import { getMeetingsFromVirtualNA } from '../util';
import Constants from 'constants';

export default class MeetingsFetchCron extends CronModule {

    db: any;
    repository: any;
    channels: string[] = [];

    constructor() {
        super('MeetingsFetch', new CronOptions({
            name: 'Meetings - Fetch',
            time: '0 0 */1 * * *',
            runOnInit: true,
        }));
    }

    ready() {
        try {
            super.ready();
            this.repository = this.client.db.Meeting;
        } catch(e) {
            this.client.logger.warn(e);
        }
    };

    async exec() {
        try {
            const currentMeetings = await getMeetingsFromVirtualNA();
            const currentMeetingsId = currentMeetings.map(meeting => meeting.id);

            currentMeetings.forEach(async (meeting) => {
                const { action } = await this.repository.createOrUpdate(meeting);
                if (action) {
                    console.log(action);
                }
            });

            // Remove old meetings
            const currentMeetingsDb = await this.repository.whereEqualTo('source', Constants.Meetings.Sources.VIRTUAL_NA).find();
            const deletedMeetingsId = currentMeetingsDb.filter(meeting => !currentMeetingsId.includes(meeting.id)).map(meeting => meeting.id);

            deletedMeetingsId.forEach(async (id) => await this.repository.delete(id));
        } catch(e) {
            this.client.logger.warn(e);
        }
    }


}