import { Command, Message } from 'discord-akairo';
import { getPaths } from 'util/object';
import { Permissions } from 'discord.js';
import {
  get, set, remove, assign, difference, unset,
} from 'lodash';
import { ServerSettings } from 'models/database/TutelaryServerSettings';

export default class SettingsCommand extends Command {
    settings: any;

    constructor() {
      super('settings', {
        aliases: ['settings', 'set'],
        description: {
          content: 'View or set settings for server/guild.',
          usage: '[property] [value',
          examples: [
            'settings timezone Melbourne/Australia',
            'settings jftCron.enabled true',
          ],
        },
        typing: true,
        cooldown: 5000,
        ratelimit: 1,
        channel: 'text',
        userPermissions: [
          Permissions.FLAGS.MANAGE_GUILD,
        ],
      });
    }

    * args() {
      const property = yield { id: 'property' };
      const value = yield { id: 'value', match: 'rest' };

      return {
        property,
        value,
      };
    }

    async before(message: Message) {
      try {
        const settings = await this.client.db.Server.getServerSettings(message.guild.id);
        const defaultObject = JSON.parse(JSON.stringify(new ServerSettings()));
        const settingsObject = settings.get('settings');

        unset(settingsObject, difference(getPaths(settingsObject), getPaths(defaultObject)));

        this.settings = settings;
        this.settingsObject = assign({}, defaultObject, settingsObject);
        this.settingsPaths = remove(getPaths(this.settingsObject), (v) => !['jftCron', 'meeting', 'admin'].includes(v));
      } catch (e) {
        this.client.logger.error(e);
      }
    }

    async exec(message: Message, { property, value }: args) {
      try {
        if (!property) {
          const values = this.settingsPaths
            .map((path) => `${path} = ${JSON.stringify(get(this.settingsObject, path))}`);

          message.channel.send([
            '```bash',
            ...values,
            '```',
          ]);
        } else if (property && !value) {
          if (this.settingsPaths.includes(property)) {
            message.channel.send(['```bash', `${property} = ${JSON.stringify(get(this.settingsObject, property))}`, '```']);
          } else {
            // @TODO: Handle error message here.
            return false;
          }
        } else if (this.settingsPaths.includes(property)) {
          set(this.settingsObject, property, JSON.parse(value));
          await this.settings.update({ settings: this.settingsObject });
          message.channel.send(['Done.', '```bash\n', `${property} = ${value}`, '```']);
        } else {
          // @TODO: Handle error message here.
          return false;
        }
      } catch (e) {
        this.client.logger.error(e);
      }
    }
}
