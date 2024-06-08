import { Column, Model, Table,ForeignKey,BelongsTo } from 'sequelize-typescript';
import { GtfsFile } from './gtfsfile.model';

@Table
export class GtfsShape extends Model{

  @Column
  shape_id!: string;

  @Column
  shape_pt_lat!: Number;

  @Column
  shape_pt_lon!: Number;

  @Column
  shape_pt_sequence!: Number;

  @ForeignKey(() => GtfsFile)
  @Column
  gtfs_file_id!: Number

  @BelongsTo(() => GtfsFile)
  gtfsFile!: GtfsFile;

}

