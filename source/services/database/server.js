import DatabaseService from 'services/database';

export default class ServerDatabaseService extends DatabaseService {
  async getServer(id, options = {}) {
    return this.findById(id, options);
  }

  async getServerSettings(id) {
    const server = await this.getServer(id, {
      include: [this.provider.models.TutelaryServerSettings],
    });

    return server.get('settings');
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
      name: guild.name,
      since: guild.joinedTimestamp,
      owners: [guild.ownerID],
      region: guild.region,
    };
  }
}
