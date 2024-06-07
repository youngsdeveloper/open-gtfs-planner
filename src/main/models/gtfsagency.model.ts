import { Column, Model, Table,ForeignKey,BelongsTo } from 'sequelize-typescript';
import { GtfsFile } from './gtfsfile.model';

@Table
export class GtfsAgency extends Model{

  @Column
  name!: string;

  @Column
  gtfs_agency_id!: Number

  @ForeignKey(() => GtfsFile)
  @Column
  gtfs_file_id!: Number

  @BelongsTo(() => GtfsFile)
  gtfsFile!: GtfsFile;

}

