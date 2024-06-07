import { Column, Model, Table,ForeignKey,BelongsTo,HasMany } from 'sequelize-typescript';
import { GtfsFile } from './gtfsfile.model';
import { GtfsRoute } from './gtfsroute.model';

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

  
  @HasMany(() => GtfsRoute)
  routes!: GtfsRoute[];

}

