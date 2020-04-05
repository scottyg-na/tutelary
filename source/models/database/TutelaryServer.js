import { Column, DataType, Model, PrimaryKey, Table, AllowNull, Default, HasOne } from 'sequelize-typescript';
import TutelaryServerSettings from 'models/database/TutelaryServerSettings';

@Table({ tableName: 'servers' })
export default class TutelaryServer extends Model<TutelaryServer> {

    @PrimaryKey
    @Column({ type: DataType.STRING, allowNull: false })
    id: String;

    @Column({ type: DataType.STRING, allowNull: false })
    name: String;

    @Column({ type: DataType.DATE, allowNull: false })
    since: Date;

    @Column({ type: DataType.JSON, allowNull: false })
    owners: Array;

    @Column({ type: DataType.STRING, allowNull: false })
    region: String;

    @HasOne(() => TutelaryServerSettings)
    settings: TutelaryServerSettings;
}