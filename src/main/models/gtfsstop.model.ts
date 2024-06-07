import { Column, Model, Table,ForeignKey,BelongsTo } from 'sequelize-typescript';
import { GtfsFile } from './gtfsfile.model';

@Table
export class GtfsStop extends Model{

  @Column
  gtfs_stop_id!: Number;

  @Column
  stop_name!: string;

  @Column
  stop_lat!: Number;

  @Column
  stop_lon!: Number;


  @ForeignKey(() => GtfsFile)
  @Column
  gtfs_file_id!: Number

  @BelongsTo(() => GtfsFile)
  gtfsFile!: GtfsFile;

}

