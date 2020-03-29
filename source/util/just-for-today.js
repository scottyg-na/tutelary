import { MessageEmbed } from 'discord.js';
import { DateTime } from 'luxon';
import getBotDateTime from 'util/date/getBotDateTime'
import jft from 'static/jft.json';

export function getForDate(date: DateTime = DateTime.local()) {
    return jft[getBotDateTime().toFormat('M-d')];
}

export function getForToday() {
    return getForDate();
}

export function getEmbeddedMessage(jft = {}) {
    return new MessageEmbed()
        .setColor('#0099ff')
        .setAuthor(`${jft.date}`)
        .setTitle(`${jft.vision}`)
        .setDescription([
            `_${jft.quote}_`,
            `${jft.reference}`,
            '',
            '-------------',
        ].concat(jft.article.reduce((r, a) => r.concat(a, ''), [''])))
        .addFields(
            { name: 'Just For Today', value: jft.jft },
        )
}