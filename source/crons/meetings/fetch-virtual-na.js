import { Command } from 'discord-akairo';
import CronModule from 'modules/cron';
import CronOptions from 'models/CronOptions';
import { CronJob } from 'cron';
import { getMeetingsFromVirtualNA } from 'util/meetings';
import Constants from 'constants';
import TutelaryClient from 'client';

export default class FetchVirtualNACron extends CronModule {

    constructor() {
        super('FetchVirtualNA', {});
    }

    load(client: TutelaryClientlient) {

    }

    async fetchFromNA() {
        // return {

        //     this.options.time,
        //     () => {
        //         this.handler.emit(Constants.Events.CRON_STARTED, this.options.name, this.id);
        //         this.exec();
        //         this.handler.emit(Constants.Events.CRON_FINISHED, this.options.name, this.id);
        //     },
        //     () => { },
        //     true,
        //     process.env.BOT_TIMEZONE,
        //     this,
        //     false,
        // );
        // const currentMeetings = await getMeetingsFromVirtualNA();
    }

    async exec() {
        // console.log('testasdasd');
        // try {
        //     const currentMeetings = ;
        //     const currentMeetingsId = currentMeetings.map(meeting => meeting.id);

        //     currentMeetings.forEach(async (meeting) => {
        //         const { action } = await this.repository.createOrUpdate(meeting);
        //         if (action) {
        //             console.log(action);
        //         }
        //     });

        //     // Remove old meetings
        //     const currentMeetingsDb = await this.repository.whereEqualTo('source', Constants.Meetings.Sources.VIRTUAL_NA).find();
        //     const deletedMeetingsId = currentMeetingsDb.filter(meeting => !currentMeetingsId.includes(meeting.id)).map(meeting => meeting.id);

        //     deletedMeetingsId.forEach(async (id) => await this.repository.delete(id));
        // } catch (e) {
        //     this.client.logger.warn(e);
        // }
    }


}