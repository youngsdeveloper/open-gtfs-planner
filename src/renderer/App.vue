<script lang="ts" setup>
    import Layers from './components/Layers.vue'
    import Map from './components/Map.vue'

</script>

<template>
  <div>

    <div class="uk-margin-medium-top">
        <div uk-grid>
            <aside class="uk-width-1-4" aria-label="capas">
                <div class="uk-container">

                    <div v-if="loading" style="text-align: center;">
                        <div uk-spinner="ratio: 2"></div>
                    </div>
                    <div v-else>
                        <Layers :gtfs_files="gtfs_files" />
                    </div>
                </div>
            </aside>


            

    
            <section class="uk-width-expand">
                <Map :gtfs_files="gtfs_files"></Map>

            </section>
    
            <aside class="uk-width-1-5">
                <div class="uk-container">
                    <ul uk-accordion="multiple: true">
                        <li class="uk-open">
                            <a class="uk-accordion-title">Lineas</a>
                            <div class="uk-accordion-content">
                                <ul class="uk-list uk-list-divider">
                                    <li>
                                        TMP Murcia - 1
                                        <button class="uk-button uk-button-default uk-button-small uk-align-right">
                                            <span uk-icon="eye"></span>
                                        </button>
                                    </li>
                                    <li>
                                        TMP Murcia - 26
                                        <button class="uk-button uk-button-default uk-button-small uk-align-right">
                                            <span uk-icon="eye"></span>
                                        </button>
                                    </li><li>
                                        TMP Murcia - 39
                                        <button class="uk-button uk-button-default uk-button-small uk-align-right">
                                            <span uk-icon="eye"></span>
                                        </button>
                                    </li><li>
                                        TMP Murcia - 44
                                        <button class="uk-button uk-button-default uk-button-small uk-align-right">
                                            <span uk-icon="eye"></span>
                                        </button>
                                    </li>

                                </ul>


                            </div>
                        </li>
                        <li class="uk-open">
                            <a class="uk-accordion-title">Parada</a>
                            <div class="uk-accordion-content">
                                

                                <button class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom uk-margin-small-top">
                                    Fusionar paradas
                                </button>


                            </div>
                        </li>
                        <li>
                            <a class="uk-accordion-title">Horarios</a>
                            <div class="uk-accordion-content">
                                <button class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom uk-margin-small-top">
                                    Abrir horarios
                                </button>
                            </div>
                        </li>
                        <li>
                            <a class="uk-accordion-title">Opciones de simulación</a>
                            <div class="uk-accordion-content">
                                <div>
                                    <label><input class="uk-checkbox" type="checkbox" checked>Retraso +2min en 44 - Ida</label>
                                </div>
                                <div>
                                    <label><input class="uk-checkbox" type="checkbox" checked>Retraso +6min en 26 - Ida</label>
                                </div>

                                <button class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom uk-margin-small-top">
                                    Nuevo
                                </button>
                            </div>
                        </li>
                    </ul>
                </div>
            </aside>
        </div>
    </div>

  </div>
</template>


<script lang="ts">

import { GtfsDao } from '../main/daos/GtfsDao';
import { GtfsShapeDao } from '../main/daos/GtfsShapeDao';


export default {
  data() {
    return {
      gtfs_files: [] as GtfsDao[],
      shapes: [] as GtfsShapeDao[],
      loading: false
    };
  },
  mounted(){

    this.loading = true;
    window.electronAPI.downloadCurrentProject();

    let ctx = this;
    window.electronAPI.onLoadedGtfs((event, gtfs:GtfsDao) => {
        ctx.gtfs_files.push(GtfsDao.fromObject(gtfs));
    })

    window.electronAPI.addListener("loaded-project", ()=>{
        ctx.loading = false;
    })


    window.electronAPI.onLoadedShapes((event, shapes: GtfsShapeDao[], route_id: Number) => {

        for(const gtfs_file of ctx.gtfs_files){
            for(const agency of gtfs_file.agencies){
                for(const route of agency.routes){
                    if(route.id == route_id){
                        const shapesDAO = GtfsShapeDao.fromObjectToArray(shapes);
                        route.shapes.push(...shapesDAO)
                        return;
                    }
                }
            }
        }
    })
  },

};
</script>


<style scoped>
</style>
