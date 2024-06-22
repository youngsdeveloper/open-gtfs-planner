<script lang="ts" setup>
    import { GtfsTripDao } from '../../main/daos/GtfsTripDao'
    import { PropType, defineComponent } from 'vue';
    import { PanelSettings } from '../../main/daos/PanelSettings';

</script>

<template>
    <div class="trips">

        <div class="card-trip-selected uk-card uk-card-secondary uk-card-body" v-if="panelSettings.tripSelected">
            <h3 class="uk-card-title">

                {{ panelSettings.tripSelected.route.getRouteName() }}
                
                <span style="float: right;">
                    {{ panelSettings.tripSelected.getTripPercent(simulationSettings.datetimeSelected).toFixed(2) }}%
                </span>

            </h3>


            <div>
                <b>ID del viaje: </b>{{ panelSettings.tripSelected.id }}
            </div>


            <div>
                <b>Dirección: </b>{{ panelSettings.tripSelected.direction_id == 0 ? "Ida" : "Vuelta" }}
            </div>


            <div v-if="panelSettings.tripSelected.trip_headsign">
                <b>Headsign: </b>{{ panelSettings.tripSelected.trip_headsign }}
            </div>


            <div class="uk-margin-top">
                <div style="max-height: 350px;overflow-y: auto;margin-top: 20px;" v-if="panelSettings.tripSelected.getTripPercent(simulationSettings.datetimeSelected)<100">
                    <table class="uk-table uk-table-hover uk-table-divider uk-table-small">
                        <thead>
                            <tr>
                                <th>Parada</th>
                                <th>Hora</th>

                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="stopTime in panelSettings.tripSelected.stopTimes.filter(s => s.getArrivalTimeInDate(simulationSettings.datetimeSelected) > simulationSettings.datetimeSelected)">
                                <td style="font-size: 0.75em;">
                                    {{ stopTime.stop.stop_name }}
                                </td>
                                <td>
                                    {{ stopTime.arrival_time }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                

                <div v-else class="uk-text-center" uk-alert>
                    El viaje ha finalizado.
                </div>
            </div>


        </div>
        <div class="uk-card uk-card-secondary uk-card-body" v-else>
            <p>
                Selecciona un viaje en el mapa para ver sus detalles aquí.
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

})
</script>

<style scoped>
    .trips .card-trip-selected{
        padding: 15px;
    }

    .trips .uk-card{
        background: #636e72;
    }

    .trips .card-trip-selected table{
        height: 200px;
    }
</style>