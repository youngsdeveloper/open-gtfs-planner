<script lang="ts" setup>
    import Layers from './components/Layers.vue'
    import Map from './components/Map.vue'
    import Trips from './components/Trips.vue'
    import Stops from './components/Stops.vue'
    import SimulationOptions from './components/SimulationOptions.vue'

    import SimulatioBar from './components/SimulatioBar.vue'
    import moment from 'moment';
    import {SimulationOptionsHelper} from '../main/helpers/SimulationOptionsHelper'

</script>

<template>
  <div>


    <div v-show="loading" class="loading-screen">
        <img src="/logo.svg" alt="logo OpenGTFSPlanner">
        <div>
            <span uk-spinner="ratio: 4.5"></span>
        </div>

    </div>

    <div class="uk-margin-medium-top" v-show="!loading">
        <div uk-grid>
            <aside class="uk-width-1-4" aria-label="capas" >
                <div class="uk-container" >


                    <img src="/logo.svg" alt="logo OpenGTFSPlanner">
                    
                    <Layers :gtfs_files="gtfs_files" v-show="!loading_widgets" :services="services" />
                    <div v-show="loading_widgets" class="loading-widget">
                        <span uk-spinner="ratio: 3.5"></span>
                    </div>

                </div>
            </aside>


            

    
            <section class="uk-width-expand">

                <SimulatioBar :gtfs_files="gtfs_files" :simulation-settings="simulationSettings" :services="services"></SimulatioBar>


                <div v-show="!loading_widgets">
                    <div style="text-align: center; margin-bottom: 20px">
                        <a style="color: black" uk-toggle="target: #modal-trips">
                            {{ trips_in_route.filter(t => visibleSimulationRoutes.includes(t.route.id)).length }} viajes en ruta.
                        </a>
                    </div>

                    <!-- Modal Viajes -->
                    <div id="modal-trips" uk-modal>
                        <div class="uk-modal-dialog uk-modal-body">
                            <div class="uk-modal-header">
                                <h2 class="uk-modal-title">
                                    {{ trips_in_route.filter(t => visibleSimulationRoutes.includes(t.route.id)).length  }} viajes
                                </h2>
                            </div>
                            <div class="uk-modal-body">
                                <table class="uk-table uk-table-hover uk-table-divider">
                                    <thead>
                                        <tr>
                                            <th>Linea</th>
                                            <th>Hora de inicio</th>
                                            <th>Hora de fin</th>
                                            <th>% de recorrido</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="trip in trips_in_route.filter(t => visibleSimulationRoutes.includes(t.route.id)).sort(t => parseInt(t.route.route_id))">
                                            <td>
                                                {{ trip.route.getRouteName() }}
                                            </td>
                                            <td>
                                                {{  trip.getStartHour() }}
                                            </td>
                                            <td>
                                                {{  trip.getEndHour() }}
                                            </td>
                                            <td>
                                                {{ trip.getTripPercent(simulationSettings.datetimeSelected).toFixed(2) }}%
                                            </td>
                                        </tr>
                                        
                                    </tbody>
                                </table>


                            </div>

                            <button class="uk-modal-close-default" type="button" uk-close></button>
                        </div>
                    </div>

                    
                    <Map    v-show="!loading_widgets"
                            :gtfs_files="gtfs_files"
                            :trips_in_route="trips_in_route"
                            :simulation_settings="simulationSettings"
                            :visible-simulation-routes="visibleSimulationRoutes"
                            :panel-settings="panelSettings"
                            :fusedStops="fusedStops"></Map>
                </div>
                


                <div v-show="loading_widgets" class="loading-widget">
                    <span uk-spinner="ratio: 3.5"></span>
                </div>


            </section>
    
            <aside class="uk-width-1-4" aria-label="viajes">
                <div class="uk-container">
                    <ul uk-accordion="multiple: true">
                        <li class="uk-open">
                            <a class="uk-accordion-title">Viajes</a>
                            <div class="uk-accordion-content">
                                
                                <Trips 
                                    :gtfs_files="gtfs_files"
                                    :simulation-settings="simulationSettings"
                                    :panel-settings="panelSettings" />


                            </div>
                        </li>
                        <li class="uk-open">
                            <a class="uk-accordion-title">Paradas</a>
                            <div class="uk-accordion-content">



                                <Stops
                                    :simulation-settings="simulationSettings"
                                    :panel-settings="panelSettings"
                                    :project-id="project_id" />



                            </div>
                        </li>
                        <li class="uk-open">
                            <a class="uk-accordion-title">Opciones de simulación</a>
                            <div class="uk-accordion-content">


                                <SimulationOptions
                                    :simulation-options="simulationOptions"
                                    :gtfs-files="gtfs_files"
                                    :project-id="project_id"/>
                                
                            </div>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    </div>

  </div>
</template>


<script lang="ts">

import { GtfsDao } from '../main/daos/GtfsDao';
import { GtfsShapeDao } from '../main/daos/GtfsShapeDao';
import { GtfsTripDao } from '../main/daos/GtfsTripDao';
import {GtfsServiceDao} from '../main/daos/GtfsServiceDao';
import { GtfsStopDao } from '../main/daos/GtfsStopDao'
import { GtfsStopTimeDao } from '../main/daos/GtfsStopTimeDao'
import { ProjectDao } from '../main/daos/ProjectDao'
import { SimulationOptionDao } from '../main/daos/SimulationOptionDao'
import { PanelSettings } from '../main/daos/PanelSettings'
import { FusedStopDao } from '../main/daos/FusedStopDao'

export default {
  data() {
    return {
      project_id: 0 as number,
      gtfs_files: [] as GtfsDao[],
      shapes: [] as GtfsShapeDao[],
      loading: false,
      loading_widgets: false,
      original_trips: [] as GtfsTripDao[],
      active_trips: [] as GtfsTripDao[],
      simulationSettings: {
        dateSelected: this.getDate(new Date().toLocaleDateString()),
        timeSelected: new Date().toTimeString().split(' ')[0],
        datetimeSelected: new Date()
      },
      trips_in_route: [] as GtfsTripDao[],

      panelSettings: {
        tripSelected: null as GtfsTripDao | null,
        stopSelected: null as GtfsStopDao | null

      } as PanelSettings,

      simulationOptions: [] as SimulationOptionDao[],
      fusedStops: [] as FusedStopDao[]


    };
  },
  watch: {
    "simulationSettings.timeSelected": function(){

        this.recalculateSimulation()

        const datetimeSelected = new Date(this.simulationSettings.dateSelected);

        const datetimeSelectedlHours = this.simulationSettings.timeSelected.split(":").map(h =>parseInt(h))
        datetimeSelected.setHours(datetimeSelectedlHours[0], datetimeSelectedlHours[1], datetimeSelectedlHours[2]);

        this.simulationSettings.datetimeSelected = datetimeSelected;
    },
    services: function(newServices: GtfsServiceDao[], old){
        this.loading_widgets = true;

        this.panelSettings.stopSelected = null;
        this.panelSettings.tripSelected = null;


        const servicesId = newServices.map( s => s.service_id);

        this.downloadTripsByServices(servicesId)
    },
    "panelSettings.stopSelected": function(){
        const servicesId = this.services.map( s => s.service_id);

        if(this.panelSettings.stopSelected){
            if(!this.panelSettings.stopSelected.fusedStopDao){
                // Es una parada normal
                window.electronAPI.downloadStopByServices(this.panelSettings.stopSelected.id, servicesId)
            }
            else{
                // Es una Fused Stop
                window.electronAPI.downloadStopFusedByServices(this.panelSettings.stopSelected.fusedStopDao.id, servicesId)
            }
        }
    },

    simulationOptions: {
        deep: true,
        handler(){

            if(this.simulationOptions.length>0){
                const newTrips = GtfsTripDao.fromObjectToArray(this.original_trips)
                SimulationOptionsHelper.middleware(this.simulationOptions, newTrips)
                newTrips.forEach( t => t.generateDatetimes(new Date(this.simulationSettings.dateSelected))) // Generamos Datetipes
                
                this.active_trips = newTrips;
                this.recalculateSimulation();


                if(this.panelSettings.tripSelected){
                    this.panelSettings.tripSelected = newTrips.filter(t => t.id == this.panelSettings.tripSelected?.id)[0]
                }

                if(this.panelSettings.stopSelected){
                    const newST = GtfsStopTimeDao.fromObjectToArray(this.panelSettings.stopSelected.originalStopTimes);
                    SimulationOptionsHelper.middlewareST(this.simulationOptions, newST)
                    this.panelSettings.stopSelected.stopTimes = newST;
                }
            }
            

        }
    }
  },
  mounted(){
    
    this.downloadCurrentProject();

    this.loading = true;

    let ctx = this;
    window.electronAPI.onLoadedProject((event, project:ProjectDao) => {
        const project_ = ProjectDao.fromObject(project);

        ctx.gtfs_files = project_.gtfsFiles
        ctx.simulationOptions = project_.simulationOptions
        ctx.project_id = project_.id as number;
        ctx.simulationOptions = project_.simulationOptions
        ctx.fusedStops = project_.fusedStops

    })

    window.electronAPI.addListener("new_simulation_option", (event, simOpt:SimulationOptionDao)=>{

        ctx.simulationOptions.push(SimulationOptionDao.fromObject(simOpt))
    });

    window.electronAPI.addListener("new_fused_stop", (event, fusedStop: FusedStopDao)=>{
        ctx.fusedStops.push(FusedStopDao.fromObject(fusedStop))
    })


    window.electronAPI.onLoadedGtfs((event, gtfs:GtfsDao) => {

        const gtfs_ = GtfsDao.fromObject(gtfs);
        ctx.gtfs_files.push(gtfs_)
    })



    window.electronAPI.onLoadedShapes((event, shapes: GtfsShapeDao[], route_id: Number) => {

        for(const gtfs_file of ctx.gtfs_files){
            for(const agency of gtfs_file.agencies){
                for(const route of agency.routes){
                    if(route.id == route_id){
                        const shapesDAO = GtfsShapeDao.fromObjectToArray(shapes);
                        route.shapes.push(...shapesDAO)
                        return;
                    }
                }
            }
        }
    })

    window.electronAPI.addListener("deleted-gtfs", (event, gtfsId)=>{
        ctx.gtfs_files = ctx.gtfs_files.filter(f => f.id != gtfsId); // Eliminar archivo GTFS Borrado
    })

    window.electronAPI.addListener("end-loading", (event, gtfsId)=>{
        setTimeout(()=>{
            ctx.loading = false; 
            window.dispatchEvent(new Event('resize'))
        },1000); // 1s loading
    })
    
    window.electronAPI.addListener("stop_times_by_stop", (event, stopTimes: GtfsStopTimeDao[])=>{
        
        if(ctx.panelSettings.stopSelected){
            var stopTimesStop = GtfsStopTimeDao.fromObjectToArray(stopTimes)

            ctx.panelSettings.stopSelected.originalStopTimes = GtfsStopTimeDao.fromObjectToArray(stopTimesStop)

            SimulationOptionsHelper.middlewareST(this.simulationOptions, stopTimesStop)

            stopTimesStop = stopTimesStop.sort(GtfsStopTimeDao.sort)
            ctx.panelSettings.stopSelected.stopTimes = stopTimesStop
        }
    })

    window.electronAPI.addListener("loaded_stop_route", (event, data) => {


        const route = ctx.gtfs_files.flatMap(f => f.agencies).flatMap(a => a.routes).filter(r => r.id == data.route).at(0);
        if(route){
            route.stops = GtfsStopDao.fromObjectToArray(data.stops);
        }
        console.log(route);

    })
    

    window.electronAPI.addListener("trips_by_service", (event, trips:GtfsTripDao[])=>{
        
        
        const tripsDao = GtfsTripDao.fromObjectToArray(trips);

        this.original_trips = GtfsTripDao.fromObjectToArray(trips);

        // Middleware Opciones de Simulacion
        SimulationOptionsHelper.middleware(this.simulationOptions, tripsDao)


        tripsDao.forEach( t => t.generateDatetimes(new Date(ctx.simulationSettings.dateSelected))) // Generamos Datetipes

        ctx.active_trips = tripsDao;

        this.recalculateSimulation();

        this.loading_widgets = false;

        setTimeout(()=>{
            ctx.loading = false;
            window.dispatchEvent(new Event('resize'))
        },4000); // 3s loading

    });

  },

  methods: {

        downloadTripsByServices: async function(servicesId){
            window.electronAPI.downloadTripsByServices(servicesId);
        },


        downloadCurrentProject: async function(){
            window.electronAPI.downloadCurrentProject();
        },
        getDate: function(date:String){
            let year = date.split("/")[2];
            let month = date.split("/")[1].padStart(2,"0");
            let day = date.split("/")[0].padStart(2, '0');

            
            return `${year}-${month}-${day}`;
        },
        recalculateSimulation: function(){
            const simulationDateTime = new Date(this.simulationSettings.dateSelected);

            const simulationTimes = this.simulationSettings.timeSelected.split(":").map(t => parseInt(t));
            simulationDateTime.setHours(simulationTimes[0],simulationTimes[1],simulationTimes[2]);


            let visibleSimulationRoutes = this.gtfs_files.flatMap(g => g.agencies).flatMap(a => a.routes).filter(r => r.simulationVisible).map(r => r.id);

            visibleSimulationRoutes = visibleSimulationRoutes.concat(this.gtfs_files.filter(gtfs => gtfs.simulationVisible).flatMap(g => g.agencies).flatMap(a => a.routes).map(r => r.id));

            const tripsInRoute = this.active_trips.filter(t => t.isActiveInThisDate(simulationDateTime)).sort(t => t.start_datetime.getTime());

            this.trips_in_route = tripsInRoute;


        }
    },

    computed: {
        visibleSimulationRoutes: function(){
            let visibleSimulationRoutes = this.gtfs_files.flatMap(g => g.agencies).flatMap(a => a.routes).filter(r => r.simulationVisible).map(r => r.id);
            visibleSimulationRoutes = visibleSimulationRoutes.concat(this.gtfs_files.filter(gtfs => gtfs.simulationVisible).flatMap(g => g.agencies).flatMap(a => a.routes).map(r => r.id));
            return visibleSimulationRoutes;
        },
        services(){

            const services =  [] as GtfsServiceDao[];

            for(const _gtfs_file of this.gtfs_files!!){
                const gtfs_file = GtfsDao.fromObject(_gtfs_file);
                const calendarDates = gtfs_file.calendarDates.filter(c => this.getDate(c.date.toLocaleDateString()) == this.simulationSettings.dateSelected && c.exception_type==1)

                calendarDates.forEach(c => {
                    services.push(new GtfsServiceDao(c.service_id, c.gtfs_file_id, gtfs_file.filename));
                })

                for(const rule of gtfs_file.calendar){

                    let localNow = moment(this.simulationSettings.dateSelected).add("hours",2);
                    let dayOfWeek = localNow.isoWeekday();



                    if(rule.isDay(dayOfWeek)){ // Cumple con el dia  de la semana

                        let localStartDate = rule.getStartDate();
                        let localEndDate = rule.getEndDate();


                        if(localNow.isBetween(localStartDate, localEndDate)){ // Esta en el rango de fechas
                            services.push(new GtfsServiceDao(rule.service_id, rule.gtfs_file_id, gtfs_file.filename));
                        }
                    }
                }
            }

            return services;
        }
    }
};
</script>


<style scoped>

.loading-screen{
    text-align: center;
    display: grid;
    place-content: center;
    height: 100vh;
}

.loading-widget{
    text-align: center;
}

.loading-screen span, .loading-widget span{
    color: #3db295;
    font-weight: bold;
}
</style>
