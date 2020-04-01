import chrono from 'chrono-node';
import { Command, Message } from 'discord-akairo';
import { DateTime } from 'luxon';
import getBotDateTime from 'util/date/getBotDateTime';
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

    exec(message: Message, { searchDate }: args) {
        if (searchDate) {
            const date = chrono.parseDate(searchDate, getBotDateTime().toJSDate());
            if (!date) {
                // error
            } else {
                this.showMeetingsForDate(message, getBotDateTime(DateTime.fromJSDate(date)));
            }
        } else {
            this.showMeetingsForDate(message);
        }
    }

    async showMeetingsForDate(message: Message, date: DateTime = getBotDateTime()) {
        const db = this.client.handlers.db.instance;
        const repository = this.client.handlers.db.modules.get('plugins:meetings:db:meetings');

        console.log(date);

        const meetings = await repository.getMeetingsForDate(date);

        const response = this.client.util.embed()
            .setColor(Constants.Colors.BLUE)
            .setTitle(`Online Meetings for ${date.toLocaleString(DateTime.DATE_HUGE)}`)
            .addFields(MeetingsCommand.meetingToFields(meetings))

        // });

        message.channel.send(response);
    }

    static meetingToFields(meetings: Array<object>) {
        return meetings.map(meeting => {
            const date = getBotDateTime();
            const offset = date.offset;

            const [sh, sm] = meeting.start.split(':').map(t => parseInt(t, 10));
            const [dh, dm] = meeting.duration.split(':').map(t => parseInt(t, 10));

            const utc = date.set({ hour: sh, minute: sm });
            const start = utc.plus({ minutes: offset });

            const times = {
                vic: MeetingsCommand.getDatesForTz(start, [dh, dm]),
                nz: MeetingsCommand.getDatesForTz(start.setZone('Pacific/Auckland'), [dh, dm]),
                wa: MeetingsCommand.getDatesForTz(start.setZone('Australia/Perth'), [dh, dm]),
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

    static getDatesForTz(start: DateTime, [hours, minutes]: Array) {
        const end = start.plus({ hours, minutes });
        return {
            start: start.toFormat('h:mma'),
            end: end.toFormat('h:mma'),
            offset: start.offsetNameShort,
        }
    }
}