<script setup lang="ts">
    import { PropType, defineComponent } from 'vue';
    import { GtfsStopTimeDao } from '../../main/daos/GtfsStopTimeDao';
    import { ReviewTransfersHelper, ReviewTransfersSoluction } from "../../main/helpers/ReviewTransfersHelper"

</script>

<template>
    <div style="max-height: 350px;overflow-y: auto;" >
        <table class="uk-table uk-table-hover uk-table-divider uk-table-small">
            <thead>
                <tr>
                    <th>Llegada</th>
                    <th>Salida</th>
                    <th>Tiempo de espera</th>

                </tr>
            </thead>
            <tbody>

                <template v-for="sol in transfers.filter(sol => sol.previewStopTimes.length>0)">
                    <tr v-for="st in sol.previewStopTimes">
                        <td style="font-size: 1em; padding-top:15px;">
                            <span class="route-box">
                                {{ st.trip.route.getRouteName() }}
                            </span>

                            <span style="margin-left: 20px;">
                                {{ st.getArrivalTimeInHoursMins() }}
                            </span>
                        </td>
                        <td style="font-size: 1em; padding-top:15px;">
                            <span class="route-box">
                                {{ sol.st.trip.route.getRouteName() }}
                            </span>

                            <span style="margin-left: 20px;">
                                {{ sol.st.getArrivalTimeInHoursMins() }}
                            </span>
                        </td>
                        <td style="font-size: 1em; padding-top:20px;">
                            {{ Math.abs(GtfsStopTimeDao.calculateIntervalInMinutes(st, sol.st)) }}'
                        </td>
                    </tr>
                </template>
                
            </tbody>
        </table>
    </div>
</template>

<script lang="ts">

export default defineComponent({
    props: {
        transfers: {
            type: Array as PropType<ReviewTransfersSoluction[]>,
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