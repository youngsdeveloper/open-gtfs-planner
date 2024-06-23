import { Column, Model, Table, HasMany, BelongsTo, ForeignKey} from 'sequelize-typescript';
import { Project } from './project.model';
import { GtfsRoute } from './gtfsroute.model';

@Table
export class SimulationOptions extends Model{

    @ForeignKey(() => Project)
    @Column
    project_id!: Number
  
  
    @BelongsTo(() => Project)
    project!: Project;

    @ForeignKey(() => GtfsRoute)
    @Column
    route_id!: string
  
    @BelongsTo(() => GtfsRoute)
    route!: GtfsRoute;


    @Column
    delta!: Number

    @Column
    active!: Boolean
  
  
}

