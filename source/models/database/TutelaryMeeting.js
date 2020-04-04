import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Duration } from 'luxon';

@Table({ tableName: 'meetings' })
export default class TutelaryMeeting extends Model<TutelaryMeeting> {
    @PrimaryKey
    @Column({ type: DataType.STRING({ length: 32 }) })
    id: string;

    @Column({ type: DataType.STRING({ length: 32 }) })
    name: string;

    @Column({ type: DataType.STRING({ length: 32 }) })
    source: string;

    @Column({ type: DataType.INTEGER })
    sourceService: int;

    @Column({ type: DataType.STRING({ length: 32 }) })
    location: string;

    @Column({ type: DataType.STRING({ length: 256 }) })
    locationDescription: string;

    @Column({ type: DataType.ARRAY() })
    formats: Array<string>;

    @Column({ type: DataType.STRING({ length: 32 }) })
    start: string;

    @Column({ type: DataType.STRING({ length: 32 }) })
    duration: string;

    @Column({ type: DataType.STRING({ length: 32 }) })
    timezone: string;

    @Column({ type: DataType.INTEGER() })
    weekday: int;
}