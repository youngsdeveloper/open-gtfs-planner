<script lang="ts" setup>
    import { GtfsTripDao } from '../../main/daos/GtfsTripDao'
    import { PanelSettings } from '../../main/daos/PanelSettings'

    import { PropType, defineComponent } from 'vue';
    import moment from "moment";
    import { GtfsRouteDao } from '../../main/daos/GtfsRouteDao';
    import { GtfsStopTimeDao } from '../../main/daos/GtfsStopTimeDao';

    import {SyncScheduleHelper, SyncSoluction} from "../../main/helpers/SyncSchedulesHelper"
    import { ReviewTransfersHelper, ReviewTransfersSoluction } from "../../main/helpers/ReviewTransfersHelper"

    import { GtfsDao } from '../../main/daos/GtfsDao';
    import TableStopTimes from "./TableStopTimes.vue";
    import TableTransfers from "./TableTransfers.vue";
    import DoubleRange from "./DoubleRange.vue";

    import { Bar } from 'vue-chartjs'

</script>

<template>
    <div class="stops">

        <div class="card-trip-selected uk-card uk-card-secondary uk-card-body" v-if="panelSettings.stopSelected">
            <h3 class="uk-card-title">
                {{ panelSettings.stopSelected.stop_name }} ({{panelSettings.stopSelected.gtfs_stop_id  }})
            </h3>



            <div v-if="panelSettings.stopSelected.stopTimes">

                <div class="route-boxes">

                    <span v-bind:class="{'route-box-selected': routesSelected.indexOf(route.getRouteName())!=-1}" v-on:click="toggleRouteSelected(route.getRouteName())" class="route-box route-box-min" v-for="route in GtfsRouteDao.unique(panelSettings.stopSelected.stopTimes.map(st => st.trip.route)).sort(GtfsStopDao.sort)">
                        {{ route.getRouteName() }}
                    </span>
                </div>

                <div v-if="routesSelected" class="uk-margin">

                    <div  v-for="hd in headsignsLines" class="uk-grid-small uk-child-width-auto uk-grid">
                        <label><input class="uk-checkbox" type="checkbox" :value="hd" v-model="headlinesSelected" checked> {{  hd  }}</label>
                    </div>
                </div>

                <p>

                    
                    <div>
                        <b>Número de expediciones: </b>{{ numExps }}
                    </div>

                    <div>
                        <b>Amplitud del servicio: </b>{{ serviceCoverage }}
                    </div>


                    <div>
                        <Bar
                            id="my-chart-id"
                            :data="{
                                labels: Object.keys(stopTimesByHour!!),
                                datasets: [
                                    {
                                        data: Object.values(stopTimesByHour!!) as number[],
                                        label: 'Nº autobuses por hora'
                                    }
                                ]
                            }"

                            :options="{
                                responsive: true,
                                backgroundColor: '#f87979',
                                color: '#f87979',
                                borderColor: 'f87979',
                                scales: {
                                    y: {
                                        ticks: {
                                            color: 'white'
                                        }
                                    },
                                    x: {
                                        ticks: {
                                            color: 'white'
                                        }
                                    }
                                }
                            }"
                        />
                    </div>
                </p>
                


                <div style="margin-bottom: 50px;">
                    <a uk-toggle style="margin-top: 20px;" :href="'#modal-sync-schedules-'+panelSettings.stopSelected.id"  class="uk-button uk-button-primary">
                        Sincronizar horarios
                    </a>
                    <a uk-toggle  :href="'#modal-review-transfers-'+panelSettings.stopSelected.id" style="margin-top: 20px;" class="uk-button uk-button-primary">
                        Revisar transbordos
                    </a>

                    <a v-on:click="downloadNearStops()" class="uk-button uk-button-primary" style="margin-top:20px" v-if="panelSettings.stopSelected.fusedStopDao==null">
                        Fusionar paradas
                    </a>
                </div>

                <div v-bind:id="'modal-sync-schedules-' + panelSettings.stopSelected.id" class="uk-flex-top" uk-modal ref="modal_sync_schedules">
                    <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">

                        <button class="uk-modal-close-default" type="button" uk-close></button>



                        <div uk-alert>
                            Selecciona las rutas que sincronizarán sus horarios.
                        </div>
                        <div class="route-boxes">

                            <span v-bind:class="{'route-box-selected': routesSelected.includes(route.getRouteName())}" v-on:click="toggleRouteSelected(route.getRouteName())" class="route-box route-box-min" v-for="route in GtfsRouteDao.unique(panelSettings.stopSelected.stopTimes.map(st => st.trip.route)).sort(GtfsStopDao.sort)">
                                {{ route.getRouteName() }}
                            </span>
                        </div>


                        <div uk-alert>
                            Elige las rutas que quieras mantener como fijas (sin cambiar su horario)
                        </div>

                        <div class="route-boxes">
                            <template  v-for="route in GtfsRouteDao.unique(panelSettings.stopSelected.stopTimes.map(st => st.trip.route)).sort(GtfsStopDao.sort)">
                                <span v-if="routesSelected.includes(route.getRouteName())" v-bind:class="{'route-box-selected': routesFixedSelected.includes(route.getRouteName())}" v-on:click="toggleRouteFixedSelected(route.getRouteName())" class="route-box route-box-min">
                                    {{ route.getRouteName() }}
                                </span>
                            </template>
                        </div>


                        <div uk-alert>
                            Elige los destinos (headsigns) de las lineas que deseas sincronizar
                        </div>

                        <div  v-for="hd in headsignsLines" class="uk-grid-small uk-child-width-auto uk-grid">
                            <label><input class="uk-checkbox" type="checkbox" :value="hd" v-model="headlinesSelected" checked> {{  hd  }}</label>
                        </div>


                        <div class="uk-margin">
                            <button class="uk-button uk-button-danger" v-on:click="calculateOptimization()">Calcular horarios óptimos</button>
                        </div>
            



                        <div v-if="optimizationSettings.solution">
                            <div class="uk-alert-primary" uk-alert>
                                Modifica la linea {{ optimizationSettings.solution.route?.getRouteName() }}, "{{ optimizationSettings.solution.delta }}" minutos para
                                optimizar los horarios de esta linea.
                            </div>

                            <button class="uk-button" v-on:click="storeOptimizationAsSimulationOption()">
                                Añadir modificación a Opciones de Simulación
                            </button>

                            <h4>
                                Horarios optimizados
                            </h4>
                            
                            <TableStopTimes :stop-times="optimizationSettings.solution.stopTimes" />


                        </div>

                    </div>
                </div>

                <div v-bind:id="'modal-review-transfers-' + panelSettings.stopSelected.id" class="uk-flex-top" uk-modal>
                    <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">

                        <button class="uk-modal-close-default" type="button" uk-close></button>



                        <div uk-alert>
                            Ruta de origen
                        </div>
                        <div class="route-boxes">

                            <span v-bind:class="{'route-box-selected': reviewTransfer.from==route.getRouteName()}" v-on:click="reviewTransfer.from=route.getRouteName()" class="route-box route-box-min" v-for="route in GtfsRouteDao.unique(panelSettings.stopSelected.stopTimes.map(st => st.trip.route)).sort(GtfsStopDao.sort)">
                                {{ route.getRouteName() }}
                            </span>
                        </div>


                        <div uk-alert>
                            Ruta de destino
                        </div>

                        <div class="route-boxes">
                            <span v-bind:class="{'route-box-selected': reviewTransfer.to==route.getRouteName()}" v-on:click="reviewTransfer.to=route.getRouteName()" class="route-box route-box-min" v-for="route in GtfsRouteDao.unique(panelSettings.stopSelected.stopTimes.map(st => st.trip.route)).sort(GtfsStopDao.sort)">
                                {{ route.getRouteName() }}
                            </span>
                        </div>

                        <div uk-alert>
                            Elige los destinos (headsigns) de las lineas que deseas analizar
                        </div>

                        <div  v-for="hd in headsignsLinesTransfer" class="uk-grid-small uk-child-width-auto uk-grid">
                            <label><input class="uk-checkbox" type="checkbox" :value="hd" v-model="headlinesTransferSelected" checked> {{  hd  }}</label>
                        </div>

                        <div class="uk-margin">
                            <label for="">
                                Tiempo de espera
                            </label>

                            <DoubleRange
                                :reviewTransfer="reviewTransfer"/>


                            <div>

                                {{  Math.min(reviewTransfer.minWaitTime,reviewTransfer.maxWaitTime) }} min. -
                                {{  Math.max(reviewTransfer.minWaitTime,reviewTransfer.maxWaitTime) }} min.
                            </div>
                        </div>


                        <div class="uk-margin">
                            <button class="uk-button uk-button-danger" v-on:click="calculateTransfers()">Calcular transbordos</button>
                        </div>
            




                        <div v-if="reviewTransfer.solution">

                            <div>
                                <b>Número de transbordos: </b>{{ reviewTransfer.solution.filter(sol => sol.previewStopTimes.length>0).length }}
                            </div>
                            <div>
                                <b>Tiempo de espera medio: </b>
                                {{ ReviewTransfersHelper.getAvgReviewTransfers(reviewTransfer.solution).toFixed(2) }}
                            </div>
                            <div>
                                <b>Número de expediciones sin transbordo posible: </b>{{ reviewTransfer.solution.filter(sol => sol.previewStopTimes.length==0).length }}
                            </div>




                            <div class="uk-margin">
                                <TableTransfers :transfers="reviewTransfer.solution"/>
                            </div>

                        </div>

                    </div>
                </div>

                <div ref="modal_merge_stops" v-bind:id="'modal-merge-stops-' + panelSettings.stopSelected.id" class="uk-flex-top" uk-modal>
                    <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">

                        <button class="uk-modal-close-default" type="button" uk-close></button>



                        <div v-if="stops_near">

                            <div uk-alert>
                                Elige una parada para realizar la fusión de paradas.
                                <br/><br/>
                                Una vez fusiones la parada, se incluirán las lineas y horarios de las dos paradas.
                            </div>


                            <table class="uk-table uk-table-hover uk-table-divider uk-table-small">
                                <thead>
                                    <tr>
                                        <th>Parada</th>
                                        <th>GTFS File</th>
                                        <th>Distancia</th>
                                        <th>Acciones</th>

                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="stop in stops_near.filter(s => s.stop_id != panelSettings.stopSelected.id)">
                                        <td>
                                            {{ stop.stop_name }} ({{ stop.gtfs_stop_id }})
                                        </td>
                                        <td>
                                            {{ stop.filename }}
                                        </td>
                                        <td>
                                            {{ stop.distance.toFixed(2) }} km
                                        </td>
                                        <td>
                                            <button class="uk-button uk-button-danger uk-button-small" v-on:click="saveFusedStop(panelSettings.stopSelected.id, stop.stop_id)">
                                                Fusionar
                                            </button>

                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div v-else>
                            <span uk-spinner="ratio: 3.5"></span>

                        </div>

                    </div>
                </div>




                <div v-if="routesSelected.length>0" >
                    <button v-on:click="showAllStopTimes=!showAllStopTimes" class="uk-button uk-width-1-1 uk-button-primary" style="margin-bottom: 20px;">
                        <template v-if="showAllStopTimes">
                            Ocultar previos
                        </template>
                        <template v-else>
                            Ver todos
                        </template>
                    </button>
                    <TableStopTimes :stop-times="stopTimesByStop" />
                </div>
                <div v-else>
                    <div uk-alert>
                        Selecciona rutas para poder visualizar sus horarios.
                    </div>
                </div>

                
                
            </div>




        </div>
        <div class="uk-card uk-card-secondary uk-card-body" v-else>
            <p>
                Selecciona una parada en el mapa para ver sus detalles aquí.
            </p>
        </div>
    </div>
</template>

<script lang="ts">

import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { GtfsStopDao } from '../../main/daos/GtfsStopDao';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

export default defineComponent({
    props:{
        simulationSettings: {
            type: Object,
            required: true
        },
        panelSettings: {
            type: PanelSettings,
            required: true
        },
        projectId: {
            type: Number,
            required: true
        }

    },

    data: function(){
        return {
            moment: moment,
            routesSelected: [] as String[],
            routesFixedSelected: [] as String[],

            optimizationSettings: {
                solution: null as SyncSoluction|null
            },
            chartData: {
                labels: [ 'January', 'February', 'March' ],
                datasets: [ { data: [40, 20, 12] } ]
            },

            showAllStopTimes: false,

            reviewTransfer: {
                from: null as String|null,
                to: null as String|null,
                solution: null as ReviewTransfersSoluction[]|null,
                minWaitTime: 5,
                maxWaitTime: 15
            },

            stops_near: null,


            headlinesSelected: [] as String[],
            headlinesTransferSelected: [] as String[],


        }
    },

    computed: {


        stopTimesByHour: function(){


            if(!this.panelSettings.stopSelected){
                return null;
            }

            var stimes = this.panelSettings.stopSelected.stopTimes;
            
            if(this.routesSelected.length>0){
                stimes = this.stopsTimesFiltered;
            }
            

            return GtfsStopTimeDao.getStopTimesByHour(stimes);
        },

        stopsTimesFiltered: function(){
            if(!this.panelSettings.stopSelected){
                return [];
            }
            var st =  this.panelSettings.stopSelected.stopTimes
                        .filter(st => this.routesSelected.includes(st.trip.route.getRouteName()));

            if(this.headlinesSelected.length>0){
                st = st.filter(st => this.headlinesSelected.includes(st.getHeadsign()));
            }

            return st;
        },
        serviceCoverage: function(){
            if(!this.panelSettings.stopSelected){
                return "-";
            }

            if(this.panelSettings.stopSelected.stopTimes.length==0){
                return "-";
            }

            if(this.routesSelected.length==0){

                const A = this.panelSettings.stopSelected.stopTimes[0].getArrivalTimeInHoursMins()
                const B = this.panelSettings.stopSelected.stopTimes.at(-1)!!.getArrivalTimeInHoursMins()

                return  `${A} - ${B}`;
            }else{

                const A = this.stopsTimesFiltered[0].getArrivalTimeInHoursMins()
                const B = this.stopsTimesFiltered.at(-1)!!.getArrivalTimeInHoursMins()
                
                return  `${A} - ${B}`;

            }
        },
        numExps: function(){
            if(!this.panelSettings.stopSelected){
                return 0;
            }

            if(this.routesSelected.length==0){
                return this.panelSettings.stopSelected.stopTimes.length ;
            }else{
                return this.stopsTimesFiltered.length;
            }
        },

        stopTimesByStop: function(){

            if(this.panelSettings.stopSelected==null){
                return [];
            }

            var stopTimesByStop = this.stopsTimesFiltered;

            if(!this.showAllStopTimes){
                stopTimesByStop = stopTimesByStop.filter(st => this.simulationSettings.datetimeSelected.getTime() <= st.getArrivalTimeInDate(this.simulationSettings.datetimeSelected).getTime());
            }

            
            return stopTimesByStop.sort(GtfsStopTimeDao.sort)

        },

        headsignsLines: function(){
            if(!this.panelSettings.stopSelected){
                return [];
            }

            if(!this.panelSettings.stopSelected.stopTimes){
                return [];
            }
            return [...new Set(this.panelSettings.stopSelected.stopTimes
                                .filter(st => this.routesSelected.includes(st.trip.route.getRouteName()))
                                .map(st => st.getHeadsign()))];
                                
        },

        headsignsLinesTransfer: function(){
            if(!this.panelSettings.stopSelected){
                return [];
            }

            if(!this.panelSettings.stopSelected.stopTimes){
                return [];
            }
            return [...new Set(this.panelSettings.stopSelected.stopTimes
                        .filter(st => [this.reviewTransfer.from, this.reviewTransfer.to].includes(st.trip.route.getRouteName()))
                        .map(st => st.getHeadsign()))];
                                
        }
    },
    methods: {
        toggleHeadsignSelected(event:any){
            console.log(event)

        },
        toggleRouteSelected(route:String){

            if(this.routesSelected.includes(route)){
                this.routesSelected = this.routesSelected.filter(r => r != route)
            }else{
                this.routesSelected.push(route)
            }

        },
        toggleRouteFixedSelected(route:String){
            if(this.routesFixedSelected.includes(route)){
                this.routesFixedSelected = this.routesSelected.filter(r => r != route)
            }else{
                this.routesFixedSelected.push(route)
            }
        },
        calculateOptimization: function(){

            if(!this.panelSettings.stopSelected){
                return;
            }

            const opt = SyncScheduleHelper.syncShedules(this.panelSettings.stopSelected, this.routesSelected, this.routesFixedSelected, this.headlinesSelected)
            const route = GtfsRouteDao.unique(this.panelSettings.stopSelected.stopTimes.map(st => st.trip.route)).filter(r => r.getRouteName() == opt?.lineMod)[0];
            opt.route = route;

            this.optimizationSettings.solution = opt;
        },
        calculateTransfers: function(){


            if(!this.panelSettings.stopSelected || !this.reviewTransfer.from || !this.reviewTransfer.to){
                return;
            }


            const minWaitTime = Math.min(this.reviewTransfer.minWaitTime,this.reviewTransfer.maxWaitTime);
            const maxWaitTime = Math.max(this.reviewTransfer.minWaitTime,this.reviewTransfer.maxWaitTime);

            console.log("Headlines");
            console.log(this.headlinesSelected);
            this.reviewTransfer.solution = ReviewTransfersHelper.reviewTransfers(this.panelSettings.stopSelected,
                                                            this.reviewTransfer.from,
                                                            this.reviewTransfer.to,
                                                            minWaitTime,
                                                            maxWaitTime,
                                                            this.headlinesSelected
                                                        )
        },
        storeOptimizationAsSimulationOption: function(){
            //window.electronAPI.saveSimulationOption(this.projectId, this.optimizationSettings.solution?.lineMod!!, this.optimizationSettings.solution?.delta!!, 0)

        },

        downloadNearStops: function(){
            if(this.panelSettings.stopSelected){
                window.electronAPI.downloadGTFSNearStops(this.panelSettings.stopSelected?.stop_lat, this.panelSettings.stopSelected?.stop_lon);

                UIkit.modal(this.$refs.modal_merge_stops).show();

            }
        },
        
        saveFusedStop: function(stop1:Number,stop2:Number){
            window.electronAPI.saveFusedStop(this.projectId, stop1,stop2)
        }
    },
    watch:{
        "panelSettings.stopSelected": function(){
            this.routesSelected = [];
            this.routesFixedSelected = [];
            this.optimizationSettings.solution = null;
            this.reviewTransfer.from = null;
            this.reviewTransfer.to = null;
            this.reviewTransfer.solution = null;

        },

        "routesSelected": {
            handler(){
                this.headlinesSelected = this.headsignsLines;
            },
            deep: true
        },
        "reviewTransfer": {
            handler(){

                this.headlinesTransferSelected = this.headsignsLinesTransfer;


            },
            deep: true
        }


    },

    mounted(){
        window.electronAPI.addListener("stops_near", (event, stops_near)=>{
            this.stops_near = stops_near;
        })

        window.electronAPI.addListener("end_creating_fused_stop", ()=>{
            UIkit.modal(this.$refs.modal_merge_stops).hide();
            UIkit.modal.alert("Paradas fusionadas correctamente.")

        })
    }

})
</script>

<style scoped>
    .stops .card-trip-selected{
        padding: 15px;
    }

    .stops .uk-card{
        background: #636e72;
    }


    .route-boxes{
        width: 100%;
        display: flex;
        flex-wrap: wrap; /* Permite que los spans se ajusten en múltiples líneas si es necesario */
        gap: 8px; /* Espacio entre los elementos */

    }
    .route-box{
        width: 40px;
        text-align: center;
        border: 2px solid black;
        padding: 6px;
        background: #218c74;
        color: white;
        font-weight: bold;
        font-size: 1.5em;
    }

    .route-box-min{
        width: 40px;
        font-size: 0.9em;
    }

    .route-box-selected{
        background: #362ae3;
    }

    .route-box-min:hover{
        background: #146e5b;
        cursor: pointer;
    }

</style>