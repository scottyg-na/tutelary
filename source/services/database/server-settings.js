import DatabaseService from 'services/database';

export default class ServerSettingsDatabaseService extends DatabaseService {
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
