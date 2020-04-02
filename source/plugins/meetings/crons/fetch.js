import { Command } from 'discord-akairo';
import CronModule from 'modules/cron';
import CronOptions from 'modules/cron/models/options';
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

    onReady() {
        try {
            super.onReady();
            this.repository = this.client.getDb('Meeting');
        } catch(e) {
            this.client.logger.warn(e);
        }
    };

    async exec() {
        try {
            // Create or update current meetings
            const currentMeetings = await getMeetingsFromVirtualNA();
            const currentMeetingsId = currentMeetings.map(meeting => meeting.id);
            await this.repository.createOrUpdateBatch(currentMeetings);

            // Remove old meetings
            const currentMeetingsDb = await this.repository.instance.whereEqualTo('source', Constants.Meetings.Sources.VIRTUAL_NA).find();
            const deletedMeetingsId = currentMeetingsDb.filter(meeting => !currentMeetingsId.includes(meeting.id)).map(meeting => meeting.id);
            await this.repository.deleteBatch(deletedMeetingsId);
        } catch(e) {
            this.client.logger.warn(e);
        }
    }
}