<script lang="ts" setup>
    import { GtfsTripDao } from '../../main/daos/GtfsTripDao'
    import { PropType, defineComponent } from 'vue';

</script>

<template>
    <div class="trips">

        <div class="card-trip-selected uk-card uk-card-secondary uk-card-body" v-if="panelSettings.tripSelected">
            <h3 class="uk-card-title">

                {{ panelSettings.tripSelected.route.route_short_name }}
                
                <span style="float: right;">
                    {{ panelSettings.tripSelected.getTripPercent(simulationSettings.datetimeSelected).toFixed(2) }}%
                </span>

            </h3>


            <div>
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
            type: Object,
            required: true
        }
    },

})
</script>

<style scoped>
    .trips .card-trip-selected{
        padding: 15px;
    }

    .trips .card-trip-selected table{
        height: 200px;
    }
</style>