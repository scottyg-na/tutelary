import { Column, DataType, Model, PrimaryKey, Table, AllowNull, Default, ForeignKey } from 'sequelize-typescript';
import { ValidateNested, IsString, IsBoolean, IsArray, IsNotEmpty, IsNotEmptyObject, IsInstance, ArrayUnique } from 'class-validator';
import TutelaryServer from 'models/database/TutelaryServer';

class MeetingSettings {
    @IsArray()
    @ArrayUnique()
    @IsNotEmpty()
    virtualNaSources: Array<int> = [];
}

class AdminSettings {
    @IsString()
    channel: string = null;
}

class JftCronSettings {

    @IsBoolean()
    enabled: Boolean = false;

    @IsArray()
    @ArrayUnique()
    @IsNotEmpty()
    channels: Array<string> = [];

    @IsString()
    time: String = null;

}

export class ServerSettings {
    @IsString()
    timezone: String = 'GMT';

    @ValidateNested()
    @IsNotEmptyObject()
    @IsInstance(AdminSettings)
    admin: AdminSettings = new AdminSettings();

    @ValidateNested()
    @IsNotEmptyObject()
    @IsInstance(JftCronSettings)
    jftCron: JftCronSettings = new JftCronSettings();

    @ValidateNested()
    @IsNotEmptyObject()
    @IsInstance(MeetingSettings)
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