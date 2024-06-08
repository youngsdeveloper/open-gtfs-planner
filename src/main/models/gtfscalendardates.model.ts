import { Column, Model, Table,ForeignKey,BelongsTo } from 'sequelize-typescript';
import { GtfsFile } from './gtfsfile.model';

@Table
export class GtfsCalendarDates extends Model{

  @Column
  service_id!: string;


  @Column
  date!: Date;

  @Column
  exception_type!: Number;

  @ForeignKey(() => GtfsFile)
  @Column
  gtfs_file_id!: Number

  @BelongsTo(() => GtfsFile)
  gtfsFile!: GtfsFile;
}

