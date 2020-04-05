import { Column, DataType, Model, PrimaryKey, Table, AllowNull, Default, ForeignKey } from 'sequelize-typescript';
import TutelaryServer from 'models/database/TutelaryServer';

class MeetingSettings {
    virtualNaSources: Array<int> = [];
}

class AdminSettings {
    channel: string = null;
}

class JftCronSettings {
    enabled: Boolean = false;
    channels: Array<string> = [];
    time: String = null;
}

export class ServerSettings {
    timezone: String = 'GMT';
    admin: AdminSettings = new AdminSettings();
    jftCron: JftCronSettings = new JftCronSettings();
    meeting: MeetingSettings = new MeetingSettings();
}

@Table({ tableName: 'servers_settings' })
export default class TutelaryServerSettings extends Model<TutelaryServerSettings> {

    @PrimaryKey
    @ForeignKey(() => TutelaryServer)
    @Column({ type: DataType.STRING, allowNull: false })
    id: String;

    @Column({ type: DataType.JSON, defaultValue: new ServerSettings() })
    settings: String;

}