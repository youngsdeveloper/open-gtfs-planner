import { Column, Model, Table,ForeignKey,BelongsTo } from 'sequelize-typescript';
import { GtfsFile } from './gtfsfile.model';

@Table
export class GtfsCalendar extends Model{

  @Column
  service_id!: string;

  
  @Column
  monday!: Number;

  @Column
  tuesday!: Number;

  @Column
  wednesday!: Number;

  @Column
  thursday!: Number;

  @Column
  friday!: Number;

  @Column
  saturday!: Number;

  @Column
  sunday!: Number;

  @Column
  start_date!: Date;

  @Column
  end_date!: Date;

  @ForeignKey(() => GtfsFile)
  @Column
  gtfs_file_id!: Number

  @BelongsTo(() => GtfsFile)
  gtfsFile!: GtfsFile;
}

