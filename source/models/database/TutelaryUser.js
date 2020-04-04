import { Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ tableName: 'users' })
export default class TutelaryUser extends Model<TutelaryUser> {
    @PrimaryKey
    @Column({ type: DataType.STRING })
    id: string;

    @Column({ type: DataType.STRING })
    name: string;
}