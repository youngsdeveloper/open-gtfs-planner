<script setup lang="ts">
import { PropType, defineComponent } from 'vue';
</script>

<template>
    <div id="simulationOptions">


        <div class="uk-card uk-card-secondary uk-card-body">
        
            <div>
                <label><input class="uk-checkbox" type="checkbox" checked> Retraso +2min en 44 - Ida</label>
            </div>
            <div v-for="simOption in simulationOptions">
                <label><input class="uk-checkbox" type="checkbox" checked>
                    Modificado {{ simOption.route.getRouteName() }} en {{ simOption.delta }} minutos.
                </label>
            </div>

            <a href="#modal-new-option" uk-toggle class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom uk-margin-small-top">
                Nuevo
            </a>

            <div id="modal-new-option" class="uk-flex-top" uk-modal>
                <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">

                    <button class="uk-modal-close-default" type="button" uk-close></button>


                    <div>
                        <fieldset class="uk-fieldset">
                            <legend class="uk-legend">Nueva opción de simulación</legend>
                            <div class="uk-margin">
                                <label class="uk-form-label">Fichero GTFS</label>

                                <select class="uk-select" aria-label="Select" v-model="gtfs_file_selected">
                                    <option v-for="gtfs_file in gtfsFiles" :value="gtfs_file">{{ gtfs_file.filename }}</option>
                                </select>
                            </div>

                            <div class="uk-margin" v-if="gtfs_file_selected">
                                <label class="uk-form-label">Agencia</label>

                                <select class="uk-select" aria-label="Select" v-model="agency_selected">
                                    <option :value="agency" v-for="agency in gtfs_file_selected.agencies">{{ agency.name }}</option>
                                </select>
                            </div>

                            <div class="uk-margin" v-if="agency_selected">
                                <label class="uk-form-label">Ruta</label>

                                <select class="uk-select" aria-label="Select" v-model="route_selected">
                                    <option :value="route" v-for="route in agency_selected.routes">{{ route.getRouteName() }}</option>
                                </select>
                            </div>

                            <div class="uk-margin" v-if="route_selected">
                                <label class="uk-form-label" for="form-stacked-text">Modificación (minutos)</label>
                                <div class="uk-form-controls">
                                    <input v-model="delta" class="uk-input" id="form-stacked-text" type="number" placeholder="Desfase en minutos (positivo o negativo)">
                                </div>
                            </div>

                            <button class="uk-button uk-button-primary" v-if="route_selected" v-on:click="saveSimulationOpton()">
                                Guardar opción de simulación
                            </button>



                        </fieldset>
                    </div>
                </div>
            </div>


        </div>
    </div>
</template>

<script lang="ts">
import { SimulationOptionDao } from '../../main/daos/SimulationOptionDao';
import { GtfsDao } from '../../main/daos/GtfsDao';
import { GtfsAgencyDao } from '../../main/daos/GtfsAgencyDao';
import { GtfsRouteDao } from '../../main/daos/GtfsRouteDao';


export default defineComponent({
    props: {
        gtfsFiles: {
            type: Array as PropType<GtfsDao[]>,
            required: true
        },
        simulationOptions: {
            type: Array as PropType<SimulationOptionDao[]>,
            required: true
        },
        projectId: {
            type: Number,
            required: true
        }
    },

    data(){
        return {
            gtfs_file_selected: this.gtfsFiles[0],
            agency_selected: null as GtfsAgencyDao|null,
            route_selected: null as GtfsRouteDao|null,
            delta: 0
        }
    },

    methods: {
        saveSimulationOpton: function(){
            this.simulationOptions.push(new SimulationOptionDao(1,1,GtfsRouteDao.fromObject(this.route_selected),this.delta))

            window.electronAPI.saveSimulationOption(this.projectId, this.route_selected?.id as number, this.delta)
        }
    }
})
</script>

<style scoped>
    #simulationOptions .card-trip-selected{
        padding: 15px;
    }

    #simulationOptions .uk-card{
        background: #636e72;
    }

    #simulationOptions .card-trip-selected table{
        height: 200px;
    }
</style>