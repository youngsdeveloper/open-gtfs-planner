import { Column, Model, Table,ForeignKey,BelongsTo,HasMany } from 'sequelize-typescript';
import { Project } from './project.model';
import { GtfsAgency } from './gtfsagency.model';
import { GtfsStop } from './gtfsstop.model';
import { GtfsRoute } from './gtfsroute.model';
import { GtfsCalendarDates } from './gtfscalendardates.model';
import { GtfsShape } from './gtfsshape.model';
import { GtfsCalendar } from './gtfscalendar.model';
import { GtfsTrip } from './gtfstrip.model';
import { GtfsStopTime } from './gtfsstoptime.model';

@Table
export class GtfsFile extends Model{

  @Column
  filename!: string;


  @ForeignKey(() => Project)
  @Column
  project_id!: Number


  @BelongsTo(() => Project)
  project!: Project;

  @HasMany(() => GtfsAgency,{
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  agencies!: GtfsAgency[];

  @HasMany(() => GtfsStop,{
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  stops!: GtfsStop[];

  @HasMany(() => GtfsCalendar,{
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  calendar!: GtfsCalendar[];

  @HasMany(() => GtfsCalendarDates,{
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  calendarDates!: GtfsCalendarDates[];

  @HasMany(() => GtfsShape,{
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  shapes!: GtfsShape[];

  @HasMany(() => GtfsTrip,{
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  trips!: GtfsTrip[];

  @HasMany(() => GtfsStopTime,{
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  stopTimes!: GtfsStopTime[];

  @HasMany(() => GtfsRoute,{
    onUpdate: "CASCADE",
    onDelete: "CASCADE",
  })
  routes!: GtfsRoute[];


}

