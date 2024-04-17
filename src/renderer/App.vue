<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'

window.electronAPI.sendMessage('Hello from App.vue!');
</script>

<template>
  <div>

    <div class=" uk-margin-medium-top">
        <div class="" uk-grid>
            <aside class="uk-width-1-5">
                <div class="uk-container">
                    <ul uk-accordion="multiple: true">
                        <li class="uk-open">
                            <a class="uk-accordion-title">Capas</a>
                            <div class="uk-accordion-content">
                                <div>
                                    <label><input class="uk-checkbox" type="checkbox" checked> TMP Murcia</label>
                                </div>
                                <div>
                                    <label><input class="uk-checkbox" type="checkbox" checked> Tranvía de Murcia</label>
                                </div>
                                <div>
                                    <label><input class="uk-checkbox" type="checkbox"> Movibus Alcantarilla</label>
                                </div>
                                <div>
                                    <label><input class="uk-checkbox" type="checkbox"> Interbus</label>
                                </div>

                                <button v-on:click="importarCapa()" class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom uk-margin-small-top">
                                    Importar capa
                                </button>


                            </div>
                        </li>
                        <li>
                            <a class="uk-accordion-title">Mapa Base</a>
                            <div class="uk-accordion-content">
                                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor reprehenderit.</p>
                            </div>
                        </li>
                    </ul>
                </div>
            </aside>
    
            <section class="uk-width-expand">
                <l-map ref="map" :zoom="zoom" :center="[37.9915664, -1.1323996]" >
                    <l-tile-layer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        layer-type="base"
                        name="OpenStreetMap"
                    ></l-tile-layer>
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
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";

export default {
  components: {
    LMap,
    LTileLayer,
  },
  data() {
    return {
      zoom: 15,
    };
  },
  methods: {
    importarCapa: function(){
        window.electronAPI.importGTFS();
    }
  }
};
</script>


<style scoped>
</style>
