import { MessageEmbed } from 'discord.js';
import { DateTime } from 'luxon';
import Constants from 'constants';
import jft from 'static/jft/content.json';

export const getForDate = (date: DateTime = DateTime.local()) => {
    return jft[date.toFormat('M-d')];
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