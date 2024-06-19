import { Column, Model, Table,ForeignKey,BelongsTo } from 'sequelize-typescript';
import { GtfsFile } from './gtfsfile.model';
import { GtfsAgency } from './gtfsagency.model';
import { GtfsRoute } from './gtfsroute.model';
import { GtfsTrip } from './gtfstrip.model';
import { DataTypes } from 'sequelize';
import { GtfsStop } from './gtfsstop.model';

@Table
export class GtfsStopTime extends Model{

  @Column({
    type: DataTypes.TIME,
    allowNull: false
  })
  arrival_time!: string;


  @Column({
    type: DataTypes.TIME,
    allowNull: false
  })
  departure_time!: string;

  @Column
  stop_sequence!: Number;

  @Column
  stop_headsign!: string;

  @Column
  pickup_type!: Number;

  @Column
  drop_off_type!: Number;

  @ForeignKey(() => GtfsTrip)
  @Column
  trip_id!: Number

  @BelongsTo(() => GtfsTrip)
  trip!: GtfsTrip;

  @ForeignKey(() => GtfsStop)
  @Column
  stop_id!: Number

  @BelongsTo(() => GtfsStop)
  stop!: GtfsStop;

  @ForeignKey(() => GtfsFile)
  @Column
  gtfs_file_id!: Number

  @BelongsTo(() => GtfsFile)
  gtfsFile!: GtfsFile;


}