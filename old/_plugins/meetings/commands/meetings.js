import chrono from 'chrono-node';
import { Command, Message } from 'discord-akairo';
import { DateTime, Duration } from 'luxon';
import { getAllMeetingsForDate } from '../util';
import Constants from 'constants';

export default class MeetingsCommand extends Command {
    constructor() {
        super('meetings', {
            category: 'general',
            aliases: ['meetings', 'meeting', 'meet'],
            description: {
                content: `View `,
                usage: '[date]',
                examples: ['', 'today', 'tomorrow', 'sunday', '24/2/2021', 'next friday']
            },
            typing: true,
            cooldown: 5000,
            ratelimit: 1,
            args: [
                {
                    id: 'searchDate',
                    match: 'rest'
                }
            ]
        });
    }

    ready() {
        this.serverRepository = this.client.db.Server;
        this.meetingRepository = this.client.db.Meeting;
    }

    async exec(message: Message, { searchDate }: args) {
        let date = DateTime.local();
        let timezone = await this.serverRepository.getTimezoneFromMessage(message);
        date = date.setZone(timezone);

        if (searchDate) {
            const parsed = chrono.parseDate(searchDate, date.toJSDate());
            if (parsed) {
                return this.showMeetingsForDate(message, DateTime.fromJSDate(parsed));
            }
        } else {
            return await this.showMeetingsForDate(message, date);
        }
    }

    async showMeetingsForDate(message: Message, date: DateTime = DateTime.local()) {
        const meetings = await this.meetingRepository.getMeetingsForDate(date);

        const response = this.client.util.embed()
            .setColor(Constants.Colors.BLUE)
            .setTitle(`Online Meetings for ${date.toLocaleString(DateTime.DATE_HUGE)}`)
            .addFields(MeetingsCommand.meetingToFields(meetings, date))

        return message.channel.send(response);
    }

    static meetingToFields(meetings: Array<object>, date: DateTime = DateTime.local()) {
        return meetings.map(meeting => {
            const offset = date.offset;

            const [sh, sm] = meeting.start.split(':').map(t => parseInt(t, 10));
            const [dh, dm] = meeting.duration.split(':').map(t => parseInt(t, 10));

            const duration = Duration.fromObject({ hours: dh, minutes: dm });

            const utc = date.set({ hour: sh, minute: sm });
            const start = utc.plus({ minutes: offset });

            const times = {
                vic: MeetingsCommand.getDatesForTz(start, duration),
                nz: MeetingsCommand.getDatesForTz(start.setZone('Pacific/Auckland'), duration),
                wa: MeetingsCommand.getDatesForTz(start.setZone('Australia/Perth'), duration),
            };

            return {
                name: `**${meeting.name}**`,
                value: [
                    `_${times.vic.start}-${times.vic.end} AEDT / ${times.wa.start}-${times.wa.end} AWST / ${times.nz.start}-${times.nz.end} NZDT_`,
                    `${meeting.location} ${(meeting.locationDescription ? '(' + meeting.locationDescription + ')' : '')}`,
                ],
            }
        });
    }

    static getDatesForTz(start: DateTime, duration: Duration) {
        return {
            start: start.toFormat('h:mma'),
            end: start.plus(duration).toFormat('h:mma'),
            offset: start.offsetNameShort,
        }
    }
}