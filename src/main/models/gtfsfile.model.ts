import { Column, Model, Table,ForeignKey,BelongsTo,HasMany } from 'sequelize-typescript';
import { Project } from './project.model';
import { GtfsAgency } from './gtfsagency.model';
import { GtfsStop } from './gtfsstop.model';
import { GtfsRoute } from './gtfsroute.model';

@Table
export class GtfsFile extends Model{

  @Column
  filename!: string;


  @ForeignKey(() => Project)
  @Column
  project_id!: Number


  @BelongsTo(() => Project)
  project!: Project;

  @HasMany(() => GtfsAgency)
  agencies!: GtfsAgency[];

  @HasMany(() => GtfsStop)
  stops!: GtfsStop[];



}

