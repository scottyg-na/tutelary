import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Duration } from 'luxon';

@Table({ tableName: 'meetings' })
export default class TutelaryMeeting extends Model<TutelaryMeeting> {
    @PrimaryKey
    @Column({ type: DataType.STRING })
    id: string;

    @Column({ type: DataType.STRING })
    name: string;

    @Column({ type: DataType.STRING })
    source: string;

    @Column({ type: DataType.INTEGER })
    sourceService: int;

    @Column({ type: DataType.STRING })
    location: string;

    @Column({ type: DataType.STRING })
    locationDescription: string;

    @Column({
        type: DataType.STRING,
        get() {
            return this.getDataValue('formats').split(',');
        },
        set(value) {
            this.setDataValue('formats', value ? value.join(','): '');
        }
    })
    formats: Array<string>;

    @Column({ type: DataType.STRING })
    start: string;

    @Column({ type: DataType.STRING })
    duration: string;

    @Column({ type: DataType.STRING })
    timezone: string;

    @Column({ type: DataType.INTEGER })
    weekday: int;
}