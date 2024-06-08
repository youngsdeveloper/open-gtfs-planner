import { Column, Model, Table,ForeignKey,BelongsTo } from 'sequelize-typescript';
import { GtfsFile } from './gtfsfile.model';
import { GtfsAgency } from './gtfsagency.model';
import { GtfsRoute } from './gtfsroute.model';

@Table
export class GtfsTrip extends Model{

  @Column
  service_id!: string;

  @Column
  trip_id!: string;

  @Column
  trip_headsign!: string;

  @Column
  direction_id!: Number;

  @Column
  block_id!: string;

  @Column
  shape_id!: string;

  @ForeignKey(() => GtfsRoute)
  @Column
  route_id!: string

  @BelongsTo(() => GtfsRoute)
  route!: GtfsRoute;
}
