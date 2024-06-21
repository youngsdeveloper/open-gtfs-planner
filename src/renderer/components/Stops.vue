<script lang="ts" setup>
    import { GtfsTripDao } from '../../main/daos/GtfsTripDao'
    import { PanelSettings } from '../../main/daos/PanelSettings'

    import { PropType, defineComponent } from 'vue';
    import moment from "moment";
import { GtfsRouteDao } from '../../main/daos/GtfsRouteDao';

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
                        {{ route.route_short_name }}
                    </span>
                </div>


                <div style="margin-bottom: 50px;">
                    <button  style="margin-top: 20px;" class="uk-button uk-button-primary">
                        Sincronizar horarios
                    </button>
                    <button  style="margin-top: 20px;" class="uk-button uk-button-primary">
                        Revisar transbordos
                    </button>
                </div>


                <div style="max-height: 350px;overflow-y: auto;">
                    <table class="uk-table uk-table-hover uk-table-divider uk-table-small">
                        <thead>
                            <tr>
                                <th>Linea</th>
                                <th>Hora</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="stopTime in panelSettings.stopSelected.stopTimes.filter(st => simulationSettings.datetimeSelected.getTime() <= st.getArrivalTimeInDate(simulationSettings.dateSelected).getTime()).filter(st => routesSelected.indexOf(st.trip.route.id)!=-1)">
                                <td style="font-size: 0.85em;">
                                    <span class="route-box">
                                        {{ stopTime.trip.route.route_short_name }}
                                    </span>
                                </td>
                                <td style="font-size: 1em; padding-top:15px;">
                                    {{ stopTime.arrival_time }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
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
        }
    },

    data: function(){
        return {
            moment: moment,
            routesSelected: [] as Number[]
        }
    },

    methods: {
        toggleRouteSelected(route:Number){
            if(this.routesSelected.indexOf(route)!=-1){
                this.routesSelected = this.routesSelected.filter(r => r != route)
            }else{
                this.routesSelected.push(route)
            }
        }
    },
    watch:{
        "panelSettings.stopSelected": function(){
            this.routesSelected = [];
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

    .stops .card-trip-selected table{
        height: 200px;
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