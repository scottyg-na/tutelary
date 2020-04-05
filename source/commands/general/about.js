import { Command, version as akairoVersion } from 'discord-akairo';
import { Message, version as discordVersion } from 'discord.js';
import * as os from 'os';
import { prettifyMs } from 'util/number';
import finder from 'find-package-json';

export default class AboutCommand extends Command {
  constructor() {
    super('about', {
      aliases: ['about', 'aboutme', 'stats', 'status'],
      description: { content: 'Displays my information.' },
    });
  }

  async exec(message: Message) {
    const {
      version, description, repository, private: isPrivate,
    } = finder(__dirname).next().value;
    const statsDescription = [
      description,
      '',
      `[**Source Code**](${repository})`,
    ];

    return message.channel.send(
      this.client.dialog(null)
        .setTitle('Tutelary')
        .setDescription(statsDescription)
        .setThumbnail(this.client.user.displayAvatarURL({ format: 'webp', size: 128 }))
        .addField('Application', [
          `**Discord.JS:** v${discordVersion}`,
          `**Akairo**: v${akairoVersion}`,
          `**Tutelary**: v${version} ${isPrivate ? '(Private Bot)' : ''}`,
        ], false)
        .addField('Discord', [
          `**Servers**: ${this.client.guilds.cache.size}`,
          `**Channels**: ${this.client.channels.cache.size}`,
          `**Users**: ${this.client.users.cache.size}`,
        ], true)
        .addField('System', [
          `**Uptime**: \t ${prettifyMs(this.client.uptime)}`,
          `**Memory**: ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
          `**NodeJS**: ${process.version}`,
          `**OS**: ${os.type()} ${os.arch()}`,
        ], false),
    );
  }
}
