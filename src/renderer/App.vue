<script lang="ts" setup>
    import Capas from './components/Capas.vue'
</script>

<template>
  <div>

    <div class="uk-margin-medium-top">
        <div uk-grid>
            <aside class="uk-width-1-5" aria-label="capas">
                <div class="uk-container">
                    <Capas />
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


                    <l-marker v-for="stop in stops" :lat-lng="stop.getLatLng()">
                    
                        <l-popup>
                            {{ stop.stop_name }}
                        </l-popup>

                    </l-marker>

                </l-map>

                <div v-for="stop in stops">
                    {{  stop }}
                    {{  stop.getLatLng() }}
                </div>

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
import { LMap, LMarker, LPopup, LTileLayer } from "@vue-leaflet/vue-leaflet";

import { GtfsStopDao } from "../main/daos/GtfsStopDao"


export default {
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },
  data() {
    return {
      stops: [] as GtfsStopDao[],
      zoom: 15
    };
  },
  mounted(){


    window.electronAPI.onLoadedStops((event, stops:GtfsStopDao[]) => {
        stops.forEach(s => {
            this.stops.push(GtfsStopDao.fromObject(s))
        })
        console.log(this.stops);
    })
  },
};
</script>


<style scoped>
</style>
