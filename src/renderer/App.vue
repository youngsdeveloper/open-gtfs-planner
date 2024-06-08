<script lang="ts" setup>
    import Capas from './components/Capas.vue'
</script>

<template>
  <div>

    <div class="uk-margin-medium-top">
        <div uk-grid>
            <aside class="uk-width-1-4" aria-label="capas">
                <div class="uk-container">
                    <Capas :gtfs_files="gtfs_files" />
                </div>
            </aside>


            

    
            <section class="uk-width-expand">
                <l-map ref="map" :zoom="zoom" :center="[37.9915664, -1.1323996]" >
                    <l-tile-layer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        layer-type="base"
                        name="OpenStreetMap"
                        attribution="Creado con OpenStreetMap"
                    ></l-tile-layer>


                    

                    <template v-for="gtfs_file in gtfs_files">
                        <l-marker v-if="gtfs_file.visible" v-for="stop in gtfs_file.stops" :lat-lng="stop.getLatLng()">
                        
                            <l-popup>
                                {{ stop.stop_name }}
                            </l-popup>

                        </l-marker>

                        <!-- <l-polyline v-if="shapes" :lat-lngs="GtfsShapeDao.getLatLngs(shapes)"></l-polyline>  -->

                    </template>

                </l-map>

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
import "leaflet/dist/leaflet.css";
import { LMap, LMarker, LPopup, LTileLayer, LPolyline } from "@vue-leaflet/vue-leaflet";

import { GtfsDao } from '../main/daos/GtfsDao';
import { GtfsShapeDao } from '../main/daos/GtfsShapeDao';


export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup,
    LPolyline
  },
  data() {
    return {
      gtfs_files: [] as GtfsDao[],
      zoom: 15,
      shapes: [] as GtfsShapeDao[]
    };
  },
  mounted(){

    window.electronAPI.downloadCurrentProject();

    let ctx = this;
    window.electronAPI.onLoadedGtfs((event, gtfs:GtfsDao) => {
        ctx.gtfs_files.push(GtfsDao.fromObject(gtfs));
    })


    window.electronAPI.onLoadedShapes((event, shapes: GtfsShapeDao[]) => {
        ctx.shapes = GtfsShapeDao.fromObjectToArray(shapes);
        console.log(GtfsShapeDao.getLatLngs(shapes));
    })
  },

};
</script>


<style scoped>
</style>
