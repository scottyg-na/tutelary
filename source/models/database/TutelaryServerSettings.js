import { Column, DataType, Model, PrimaryKey, Table, AllowNull, Default, ForeignKey } from 'sequelize-typescript';
import { Validate, ValidatorConstraint, ValidatorConstraintInterface, Equals, ValidateNested, IsString, IsBoolean, IsArray, IsNotEmpty, IsNotEmptyObject, IsInstance, ArrayUnique } from 'class-validator';
import TutelaryServer from 'models/database/TutelaryServer';
import { isValidTimezone } from 'util/date';

@ValidatorConstraint()
class IsValidTimezone implements ValidatorConstraintInterface {

    validate(tz: string) {
        return isValidTimezone(tz);
    }

}

class MeetingSettings {
    @IsString()
    source: String = '';

    @IsBoolean()
    reminders: Boolean = false;

    @IsString()
    remindersChannel: String = '';
}

class AdminSettings {
    @IsString()
    channel: string = '';
}

class JftCronSettings {

    @IsBoolean()
    enabled: Boolean = false;

    @IsArray()
    @ArrayUnique()
    channels: Array<string> = [];

    @IsString()
    time: String = '';

}

export class ServerSettings {
    @IsString()
    @Validate(IsValidTimezone, { message: "Invalid Timezone" })
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