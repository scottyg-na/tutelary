import { Column, DataType, Model, PrimaryKey, Table, AllowNull, Default, ForeignKey } from 'sequelize-typescript';
import TutelaryServer from 'models/database/TutelaryServer';

@Table({ tableName: 'servers_settings' })
export default class TutelaryServerSettings extends Model<TutelaryServerSettings> {

    @PrimaryKey
    @ForeignKey(() => TutelaryServer)
    @Column({ type: DataType.STRING, allowNull: false })
    id: String;

    @Column({ type: DataType.BOOLEAN, defaultValue: false,  })
    jftCronEnabled: String;

    @Column({ type: DataType.JSON, defaultValue: null })
    jftCronChannels: Array;

    @Column({ type: DataType.DATE, defaultValue: null })
    jftCronTime: Date;

    @Column({ type: DataType.JSON, allowNull: false, defaultValue: [] })
    virtualNaMeetingSources: Array;

}