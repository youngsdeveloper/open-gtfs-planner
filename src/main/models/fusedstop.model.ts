import { Column, Model, Table, HasMany, BelongsTo, ForeignKey} from 'sequelize-typescript';
import { Project } from './project.model';
import { GtfsRoute } from './gtfsroute.model';
import { GtfsStop } from './gtfsstop.model';

@Table
export class FusedStop extends Model{

    @ForeignKey(() => Project)
    @Column
    project_id!: Number
  
    @BelongsTo(() => Project)
    project!: Project;

    @ForeignKey(() => GtfsStop)
    @Column
    stop_1_id!: Number
  
    @BelongsTo(() => GtfsStop)
    stop_1!: GtfsStop;

    @ForeignKey(() => GtfsStop)
    @Column
    stop_2_id!: Number
  
    @BelongsTo(() => GtfsStop)
    stop_2!: GtfsStop;

    @Column
    stop_name!: string;
  
    @Column
    stop_lat!: Number;
  
    @Column
    stop_lon!: Number;
  


  
}

