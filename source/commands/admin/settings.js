import { Command, Message } from 'discord-akairo';
import { Permissions } from 'discord.js';
import {
  get, set,
} from 'lodash';

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
        this.db = this.client.db.ServerSettings;
        this.settings = (await this.db.getSettingsForServer(message.guild.id)).get('settings');
      } catch (e) {
        this.client.logger.error(e);
      }
    }

    async exec(message: Message, { property, value }: args) {
      try {
        if (!property) {
          return this.displayAll(message);
        }

        if (property && !value) {
          return this.displaySingle(message, property);
        }

        if (property && value && this.db.getSettingsPaths(this.settings).includes(property)) {
          return await this.updateSingle(message, property, value);
        }

        // return false;
      } catch (e) {
        this.client.logger.error(e);
      }

      return false;
    }

    displayAll(message: Message) {
      const { prefix } = this.client.handlers.command;
      const primaryPrefix = Array.isArray(prefix) ? prefix[0] : prefix;

      const values = this.db.getSettingsPaths(this.settings)
        .map((path) => `  "${path}": ${JSON.stringify(get(this.settings, path))},`);

      return message.channel.send(
        this.client.dialog(
          'Server Settings',
          [
            `*${message.guild.name} (ID: ${message.guild.id})*`,
            ' ',
            `For help on how to change these settings, use **${primaryPrefix}help settings [setting]**`,
            '```json',
            '{',
            ...values,
            '}',
            '```',
          ],
        ),
      );
    }

    displaySingle(message: Message, property: String) {
      if (this.db.getSettingsPaths(this.settings).includes(property)) {
        return message.channel.send(['```bash', `${property} = ${JSON.stringify(get(this.settings, property))}`, '```']);
      }
      return true;
    }

    async updateSingle(message: Message, property: String, value: any) {
      set(this.settings, property, JSON.parse(value));
      await this.db.setSettingsForServer(message.guild.id, { settings: this.settings });
      return message.channel.send(`The setting \`${property}\` has been updated, it is now \`${value}\`.`);
    }
}
