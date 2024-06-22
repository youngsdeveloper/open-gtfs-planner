<script setup lang="ts">
    import { PropType, defineComponent } from 'vue';
    import { GtfsStopTimeDao } from '../../main/daos/GtfsStopTimeDao';
</script>

<template>
    <div style="max-height: 350px;overflow-y: auto;" >
            <table class="uk-table uk-table-hover uk-table-divider uk-table-small">
                <thead>
                    <tr>
                        <th>Linea</th>
                        <th>Hora</th>
                        <th>Intervalo</th>

                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(stopTime, index) in stopTimes">
                        <td style="font-size: 0.85em;">
                            <span class="route-box">
                                {{ stopTime.trip.route.getRouteName() }}
                            </span>
                        </td>
                        <td style="font-size: 1em; padding-top:15px;">
                            {{ stopTime.arrival_time }}
                        </td>
                        <td >
                            <div v-if="index>0" style="font-size: 1em; vertical-align: middle;">
                                {{  GtfsStopTimeDao.calculateIntervalInMinutes(stopTime, stopTimes[index-1]) }}
                            </div>
                            <div v-else>
                                -
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
</template>

<script lang="ts">

export default defineComponent({
    props: {
        stopTimes: {
            type: Array as PropType<GtfsStopTimeDao[]>,
            required: true
        }
    }
})
</script>

<style>

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
</style>