<script lang="ts" setup>
    import Layers from './components/Layers.vue'
    import Map from './components/Map.vue'
    import SimulatioBar from './components/SimulatioBar.vue'
    import moment from 'moment';

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
                    
                    <Layers :gtfs_files="gtfs_files" v-show="!loading_widgets" />
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
                                                {{ trip.route.route_short_name }}
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
                            :gtfs_files="gtfs_files" :trips_in_route="trips_in_route"
                            :simulation_settings="simulationSettings"
                            :visible-simulation-routes="visibleSimulationRoutes"></Map>
                </div>
                


                <div v-show="loading_widgets" class="loading-widget">
                    <span uk-spinner="ratio: 3.5"></span>
                </div>


            </section>
    
            <aside class="uk-width-1-5" aria-label="lineas">
                <div class="uk-container">
                    <ul uk-accordion="multiple: true">
                        <li class="uk-open">
                            <a class="uk-accordion-title">Lineas</a>
                            <div class="uk-accordion-content">
                                <ul class="uk-list uk-list-divider">
                                    <li>
                                        TMP Murcia - 1
                                        <button class="uk-button uk-button-default uk-button-small uk-align-right">
                                            <span uk-icon="eye"></span>
                                        </button>
                                    </li>
                                    <li>
                                        TMP Murcia - 26
                                        <button class="uk-button uk-button-default uk-button-small uk-align-right">
                                            <span uk-icon="eye"></span>
                                        </button>
                                    </li><li>
                                        TMP Murcia - 39
                                        <button class="uk-button uk-button-default uk-button-small uk-align-right">
                                            <span uk-icon="eye"></span>
                                        </button>
                                    </li><li>
                                        TMP Murcia - 44
                                        <button class="uk-button uk-button-default uk-button-small uk-align-right">
                                            <span uk-icon="eye"></span>
                                        </button>
                                    </li>

                                </ul>


                            </div>
                        </li>
                        <li class="uk-open">
                            <a class="uk-accordion-title">Parada</a>
                            <div class="uk-accordion-content">
                                

                                <button class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom uk-margin-small-top">
                                    Fusionar paradas
                                </button>


                            </div>
                        </li>
                        <li>
                            <a class="uk-accordion-title">Horarios</a>
                            <div class="uk-accordion-content">
                                <button class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom uk-margin-small-top">
                                    Abrir horarios
                                </button>
                            </div>
                        </li>
                        <li>
                            <a class="uk-accordion-title">Opciones de simulación</a>
                            <div class="uk-accordion-content">
                                <div>
                                    <label><input class="uk-checkbox" type="checkbox" checked>Retraso +2min en 44 - Ida</label>
                                </div>
                                <div>
                                    <label><input class="uk-checkbox" type="checkbox" checked>Retraso +6min en 26 - Ida</label>
                                </div>

                                <button class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom uk-margin-small-top">
                                    Nuevo
                                </button>
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

export default {
  data() {
    return {
      gtfs_files: [] as GtfsDao[],
      shapes: [] as GtfsShapeDao[],
      loading: false,
      loading_widgets: false,
      active_trips: [] as GtfsTripDao[],
      simulationSettings: {
        dateSelected: this.getDate(new Date().toLocaleDateString()),
        timeSelected: new Date().toTimeString().split(' ')[0],
        datetimeSelected: new Date()
      },
      trips_in_route: [] as GtfsTripDao[]
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


        const servicesId = newServices.map( s => s.service_id);
        window.electronAPI.downloadTripsByServices(servicesId);
    }
  },
  mounted(){

    this.loading = true;
    window.electronAPI.downloadCurrentProject();

    let ctx = this;
    window.electronAPI.onLoadedGtfs((event, gtfs:GtfsDao) => {

        ctx.gtfs_files.push(GtfsDao.fromObject(gtfs));
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

    window.electronAPI.addListener("trips_by_service", (event, trips:GtfsTripDao[])=>{
        
        
        const tripsDao = GtfsTripDao.fromObjectToArray(trips);
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
