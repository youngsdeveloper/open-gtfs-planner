import { Column, Model, Table, HasMany} from 'sequelize-typescript';
import { GtfsFile } from './gtfsfile.model';
import { SimulationOptions } from './simulationoptions.model';

@Table
export class Project extends Model{

  @Column
  name!: string;

  @HasMany(() => GtfsFile)
  gtfsFiles!: GtfsFile[];

  @HasMany(() => SimulationOptions)
  simulationOptions!: SimulationOptions[];

}

