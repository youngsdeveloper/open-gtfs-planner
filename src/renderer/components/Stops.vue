<script lang="ts" setup>
    import { GtfsTripDao } from '../../main/daos/GtfsTripDao'
    import { PanelSettings } from '../../main/daos/PanelSettings'

    import { PropType, defineComponent } from 'vue';
    import moment from "moment";
    import { GtfsRouteDao } from '../../main/daos/GtfsRouteDao';
    import { GtfsStopTimeDao } from '../../main/daos/GtfsStopTimeDao';

    import {SyncScheduleHelper, SyncSoluction} from "../../main/helpers/SyncSchedulesHelper"
    import { GtfsDao } from '../../main/daos/GtfsDao';
    import TableStopTimes from "./TableStopTimes.vue";
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


                <div style="margin-bottom: 50px;">
                    <a uk-toggle style="margin-top: 20px;" :href="'#modal-sync-schedules-'+panelSettings.stopSelected.id"  class="uk-button uk-button-primary">
                        Sincronizar horarios
                    </a>
                    <button  style="margin-top: 20px;" class="uk-button uk-button-primary">
                        Revisar transbordos
                    </button>
                </div>

                <div v-bind:id="'modal-sync-schedules-' + panelSettings.stopSelected.id" class="uk-flex-top" uk-modal>
                    <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">

                        <button class="uk-modal-close-default" type="button" uk-close></button>



                        <div uk-alert>
                            Selecciona las rutas que sincronizarán sus horarios.<br>
                            La primera ruta que selecciones será la que se modificará para ajustarse al resto.
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

                            
                            <TableStopTimes :stop-times="optimizationSettings.solution.stopTimes" />


                        </div>

                    </div>
                </div>



                <TableStopTimes v-if="routesSelected.length>0" :stop-times="stopTimesByStop" />
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
            }
        }
    },

    computed: {
        stopTimesByStop: function(){

            if(this.panelSettings.stopSelected==null){
                return [];
            }

            return this.panelSettings.stopSelected.stopTimes
                                .filter(st => this.simulationSettings.datetimeSelected.getTime() <= st.getArrivalTimeInDate(this.simulationSettings.datetimeSelected).getTime())
                                .filter(st => this.routesSelected.indexOf(st.trip.route.id)!=-1)
                                .sort(GtfsStopTimeDao.sort)

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
        }
    },
    watch:{
        "panelSettings.stopSelected": function(){
            this.routesSelected = [];
            this.optimizationSettings.solution = null;
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