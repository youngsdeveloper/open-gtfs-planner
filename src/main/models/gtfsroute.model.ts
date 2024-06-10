import { Column, Model, Table,ForeignKey,BelongsTo, HasMany } from 'sequelize-typescript';
import { GtfsFile } from './gtfsfile.model';
import { GtfsAgency } from './gtfsagency.model';
import { GtfsTrip } from './gtfstrip.model';

@Table
export class GtfsRoute extends Model{

  @Column
  route_id!: string;


  @Column
  route_short_name!: string;

  @Column
  route_long_name!: string;

  @ForeignKey(() => GtfsAgency)
  @Column
  agency_id!: Number

  @BelongsTo(() => GtfsAgency)
  agency!: GtfsAgency;


  @HasMany(() => GtfsTrip,{
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  trips!: GtfsTrip[];
}

