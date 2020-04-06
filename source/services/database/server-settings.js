import { AkairoError } from 'discord-akairo';
import {
  difference, omit, merge, remove,
} from 'lodash';
import DatabaseService from 'services/database';
import { ServerSettings } from 'models/database/TutelaryServerSettings';
import { getPaths } from 'util/object';

const PATHS_TO_REMOVE = [
  'jftCron',
  'meeting',
  'admin',
];

export default class ServerSettingsDatabaseService extends DatabaseService {
  async getSettingsForServer(id: String, options: object = {}) {
    try {
      const defaults = new ServerSettings();
      const result = await this.findById(id, options);

      result.set('settings', JSON.parse(JSON.stringify(merge(
        defaults,
        omit(result.get('settings'), difference(getPaths(result.get('settings')), getPaths(JSON.parse(JSON.stringify(defaults))))),
      ))));

      return result;
    } catch (e) {
      throw new AkairoError(e);
    }
  }

  async setSettingsForServer(id: String, { settings }: any) {
    try {
      await this.validate(merge(new ServerSettings(), settings));

      const result = await this.findById(id);
      await result.update({ settings });
    } catch (e) {
      throw new AkairoError(e);
    }
  }

  getSettingsPaths(settings) {
    const paths = remove(getPaths(settings), (v) => !PATHS_TO_REMOVE.includes(v));
    return paths;
  }

  bulkFindOrCreate(servers: Array) {
    const serversArray = Array.isArray(servers)
      ? servers.map((server) => this.mapGuild(server))
      : Array.from(servers).map(([, server]) => this.mapGuild(server));

    return super.bulkFindOrCreate(serversArray);
  }

  mapGuild(guild) {
    return {
      id: guild.id,
    };
  }
}
