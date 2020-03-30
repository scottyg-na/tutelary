import { Command, Message } from 'discord-akairo';
import { DateTime } from 'luxon';
import getBotDateTime from 'util/date/getBotDateTime';
import { getAllMeetingsForDate } from '../util';

export default class MeetingsCommand extends Command {
    constructor() {
        super('meetings', {
            category: 'general',
            aliases: ['meetings', 'meeting', 'meet'],
            description: {
                content: 'Sends you a list of meetings.',
                usage: ['test', '[command name]'],
                examples: ['', 'today', 'tomorrow', 'sunday']
            },
            typing: true,
            cooldown: 5000,
            ratelimit: 1,
            args: [
                {
                    id: 'action',
                    type: 'string',
                    match: 'separate',
                }
            ]
        });
    }

    exec(message: Message, { action }: { action: String }) {
        return this.showMeetingsForDate(message);
        // if (!action) return this.showMeetingsForDate(message);
    }

    async showMeetingsForDate(message: Message, date: DateTime = getBotDateTime()) {
        const meetings = await getAllMeetingsForDate(date);
        const embed = this.client.util.embed()
            .setColor('#0099ff')
            .setTitle(`Online Meetings for ${date.toLocaleString(DateTime.DATE_HUGE)}`)
            .setURL('https://www.na.org.au/multi/online-meetings/');

        meetings.forEach(meeting => {
            const date = getBotDateTime();
            const offset = date.offset;
            const [startHour, startMinute] = meeting.start_time.split(':').map(t => parseInt(t));
            const [durationHour, durationMinute] = meeting.duration_time.split(':').map(t => parseInt(t));

            const startUtc = date.set({ hour: startHour, minute: startMinute });
            const start = startUtc.plus({ minutes: offset });

            const startVic = MeetingsCommand.getDatesForTz(start, [durationHour, durationMinute]);
            const startNz = MeetingsCommand.getDatesForTz(start.setZone('Pacific/Auckland'), [durationHour, durationMinute]);
            const startWa = MeetingsCommand.getDatesForTz(start.setZone('Australia/Perth'), [durationHour, durationMinute]);

            embed.addField(
                `**${meeting.meeting_name}**`,
                [
                    `_${startVic.start}-${startVic.end} AEDT / ${startWa.start}-${startWa.end} AWST / ${startNz.start}-${startNz.end} NZDT_`,
                    meeting.comments
                ]
            )

        });

        message.channel.send(embed);
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