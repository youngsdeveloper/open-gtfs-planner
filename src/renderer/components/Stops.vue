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
                {{ panelSettings.stopSelected.stop_name }}
            </h3>



            <div v-if="panelSettings.stopSelected.stopTimes">

                <div class="route-boxes">

                    <span v-bind:class="{'route-box-selected': routesSelected.indexOf(route.id)!=-1}" v-on:click="toggleRouteSelected(route.id)" class="route-box route-box-min" v-for="route in GtfsRouteDao.unique(panelSettings.stopSelected.stopTimes.map(st => st.trip.route))">
                        {{ route.getRouteName() }}
                    </span>
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
                </div>

                <div v-bind:id="'modal-sync-schedules-' + panelSettings.stopSelected.id" class="uk-flex-top" uk-modal>
                    <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">

                        <button class="uk-modal-close-default" type="button" uk-close></button>



                        <div uk-alert>
                            Selecciona las rutas que sincronizarán sus horarios.
                        </div>
                        <div class="route-boxes">

                            <span v-bind:class="{'route-box-selected': routesSelected.indexOf(route.id)!=-1}" v-on:click="toggleRouteSelected(route.id)" class="route-box route-box-min" v-for="route in GtfsRouteDao.unique(panelSettings.stopSelected.stopTimes.map(st => st.trip.route))">
                                {{ route.getRouteName() }}
                            </span>
                        </div>


                        <div uk-alert>
                            Elige las rutas que quieras mantener como fijas (sin cambiar su horario)
                        </div>

                        <div class="route-boxes">
                            <template  v-for="route in GtfsRouteDao.unique(panelSettings.stopSelected.stopTimes.map(st => st.trip.route))">
                                <span v-if="routesSelected.indexOf(route.id)!=-1" v-bind:class="{'route-box-selected': routesFixedSelected.indexOf(route.id)!=-1}" v-on:click="toggleRouteFixedSelected(route.id)" class="route-box route-box-min">
                                    {{ route.getRouteName() }}
                                </span>
                            </template>
                        </div>

                        <div class="uk-margin">
                            <button class="uk-button uk-button-danger" v-on:click="calculateOptimization()">Calcular horarios óptimos</button>
                        </div>
            



                        <div v-if="optimizationSettings.solution">
                            <div class="uk-alert-primary" uk-alert>
                                Modifica la linea {{ optimizationSettings.solution.route?.getRouteName() }}, "{{ optimizationSettings.solution.delta }}" minutos para
                                optimizar los horarios de esta linea.
                            </div>

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

                            <span v-bind:class="{'route-box-selected': reviewTransfer.from==route.id}" v-on:click="reviewTransfer.from=route.id" class="route-box route-box-min" v-for="route in GtfsRouteDao.unique(panelSettings.stopSelected.stopTimes.map(st => st.trip.route))">
                                {{ route.getRouteName() }}
                            </span>
                        </div>


                        <div uk-alert>
                            Ruta de destino
                        </div>

                        <div class="route-boxes">
                            <span v-bind:class="{'route-box-selected': reviewTransfer.to==route.id}" v-on:click="reviewTransfer.to=route.id" class="route-box route-box-min" v-for="route in GtfsRouteDao.unique(panelSettings.stopSelected.stopTimes.map(st => st.trip.route))">
                                {{ route.getRouteName() }}
                            </span>
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
    },

    data: function(){
        return {
            moment: moment,
            routesSelected: [] as Number[],
            routesFixedSelected: [] as Number[],

            optimizationSettings: {
                solution: null as SyncSoluction|null
            },
            chartData: {
                labels: [ 'January', 'February', 'March' ],
                datasets: [ { data: [40, 20, 12] } ]
            },

            showAllStopTimes: false,

            reviewTransfer: {
                from: null as Number|null,
                to: null as Number|null,
                solution: null as ReviewTransfersSoluction[]|null,
                minWaitTime: 5,
                maxWaitTime: 15
            }

        }
    },

    computed: {


        stopTimesByHour: function(){


            if(!this.panelSettings.stopSelected){
                return null;
            }

            var stimes = this.panelSettings.stopSelected.stopTimes;
            
            if(this.routesSelected.length>0){
                stimes =    stimes
                                .filter(st => this.routesSelected.indexOf(st.trip.route.id)!=-1);
            }
            

            return GtfsStopTimeDao.getStopTimesByHour(stimes);
        },
        serviceCoverage: function(){
            if(!this.panelSettings.stopSelected){
                return "-";
            }

            if(this.routesSelected.length==0){

                const A = this.panelSettings.stopSelected.stopTimes[0].getArrivalTimeInHoursMins()
                const B = this.panelSettings.stopSelected.stopTimes.at(-1)!!.getArrivalTimeInHoursMins()

                return  `${A} - ${B}`;
            }else{
                const stimes =  this.panelSettings.stopSelected.stopTimes
                                .filter(st => this.routesSelected.indexOf(st.trip.route.id)!=-1);

                const A = stimes[0].getArrivalTimeInHoursMins()
                const B = stimes.at(-1)!!.getArrivalTimeInHoursMins()
                
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
                return this.panelSettings.stopSelected.stopTimes
                                .filter(st => this.routesSelected.indexOf(st.trip.route.id)!=-1)
                                .length;
            }
        },

        

        stopTimesByStop: function(){

            if(this.panelSettings.stopSelected==null){
                return [];
            }

            var stopTimesByStop = this.panelSettings.stopSelected.stopTimes
                                .filter(st => this.routesSelected.indexOf(st.trip.route.id)!=-1);

            if(!this.showAllStopTimes){
                stopTimesByStop = stopTimesByStop.filter(st => this.simulationSettings.datetimeSelected.getTime() <= st.getArrivalTimeInDate(this.simulationSettings.datetimeSelected).getTime());

            }
            
            return stopTimesByStop.sort(GtfsStopTimeDao.sort)

        }
    },
    methods: {
        toggleRouteSelected(route:Number){
            if(this.routesSelected.indexOf(route)!=-1){
                this.routesSelected = this.routesSelected.filter(r => r != route)
            }else{
                this.routesSelected.push(route)
            }
        },
        toggleRouteFixedSelected(route:Number){
            if(this.routesFixedSelected.indexOf(route)!=-1){
                this.routesFixedSelected = this.routesFixedSelected.filter(r => r != route)
            }else{
                this.routesFixedSelected.push(route)
            }
        },
        calculateOptimization: function(){

            if(!this.panelSettings.stopSelected){
                return;
            }

            const opt = SyncScheduleHelper.syncShedules(this.panelSettings.stopSelected, this.routesSelected, this.routesFixedSelected)
            const route = GtfsRouteDao.unique(this.panelSettings.stopSelected.stopTimes.map(st => st.trip.route)).filter(r => r.id == opt?.lineMod)[0];
            opt.route = route;

            this.optimizationSettings.solution = opt;
        },
        calculateTransfers: function(){


            if(!this.panelSettings.stopSelected || !this.reviewTransfer.from || !this.reviewTransfer.to){
                return;
            }


            const minWaitTime = Math.min(this.reviewTransfer.minWaitTime,this.reviewTransfer.maxWaitTime);
            const maxWaitTime = Math.max(this.reviewTransfer.minWaitTime,this.reviewTransfer.maxWaitTime);

            this.reviewTransfer.solution = ReviewTransfersHelper.reviewTransfers(this.panelSettings.stopSelected,
                                                            this.reviewTransfer.from,
                                                            this.reviewTransfer.to,
                                                            minWaitTime,
                                                            maxWaitTime
                                                        )
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
        width: 25px;
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