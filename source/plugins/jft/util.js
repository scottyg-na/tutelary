import { MessageEmbed } from 'discord.js';
import { DateTime } from 'luxon';
import Constants from 'constants';
import getBotDateTime from 'util/date/getBotDateTime';
import jft from './static/just-for-today.json';

export const getForDate = (date: DateTime = DateTime.local()) => {
    return jft[getBotDateTime().toFormat('M-d')];
}

export const getForToday = () => {
    return getForDate();
}

export function getEmbeddedMessage(jft = {}) {
    return new MessageEmbed()
        .setColor(Constants.Colors.BLUE)
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