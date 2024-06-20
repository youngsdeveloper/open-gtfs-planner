<script lang="ts" setup>
    import { GtfsTripDao } from '../../main/daos/GtfsTripDao'
    import { PropType, defineComponent } from 'vue';

</script>

<template>
    <div class="stops">

        <div class="card-trip-selected uk-card uk-card-secondary uk-card-body" v-if="panelSettings.stopSelected">
            <h3 class="uk-card-title">

                {{ panelSettings.stopSelected.stop_name }}
                
                


            </h3>


            {{  panelSettings.stopSelected  }}

            <div v-if="panelSettings.stopSelected.stopTimes">
                <table class="uk-table uk-table-hover uk-table-divider uk-table-small">
                    <thead>
                        <tr>
                            <th>Linea</th>
                            <th>Hora</th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="stopTime in panelSettings.stopSelected.stopTimes">
                            <td style="font-size: 0.75em;">
                                {{ stopTime.route.route_short_name }}
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
            type: Object,
            required: true
        }
    },

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
</style>