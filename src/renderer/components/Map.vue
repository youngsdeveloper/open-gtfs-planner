<script lang="ts" setup >
import * as L from 'leaflet';

import { GtfsDao } from '../../main/daos/GtfsDao';
import { GtfsShapeDao } from '../../main/daos/GtfsShapeDao';

import { LMap, LMarker, LPopup, LTileLayer, LPolyline, LIcon } from "@vue-leaflet/vue-leaflet";
import { GtfsTripDao } from '../../main/daos/GtfsTripDao';
import { PropType, defineComponent } from 'vue';


import "leaflet/dist/leaflet.css"
</script>

<template>
    <div style="width: 100%; height: 700px;">
        <l-map ref="map" 
                :zoom="zoom" 
                :center="[37.9915664, -1.1323996]"
                style="width: 100%; height: 700px;"
                @click="handleMapClick">
            <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                layer-type="base"
                name="OpenStreetMap"
                attribution="Creado con OpenStreetMap"
            ></l-tile-layer>




            <!-- Simulación -->
            <template v-for="trip in trips_in_route">

                <l-marker v-if="visibleSimulationRoutes.includes(trip.route.id)"
                            :lat-lng="L.latLng(trip.getCurrentPosition(simulation_settings.datetimeSelected)!)"
                            :z-index-offset="1000"
                            :key="trip.id"
                            @click="panelSettings.tripSelected=trip">
                        
                            <l-icon
                                :icon-anchor="routeIcon.iconAnchor"
                                :icon-size="routeIcon.iconSize"
                                :class-name="getClassNameMarker(trip)">
                                    <span class="marker-route-title">
                                        {{ trip.route.route_short_name }}
                                    </span>
                            </l-icon>

                </l-marker>

                <template v-if="visibleStopsRoutes.includes(trip.route.id)">
                    <l-marker v-for="stop_trip in trip.stopTimes.flatMap(st => st.stop)" :lat-lng="L.latLng(stop_trip.getLatLng())" />
                </template>

            </template>
            

            <template v-for="gtfs_file in gtfs_files">
                <template v-if="gtfs_file.visible">
                    
                    <template v-for="agency in gtfs_file.agencies">
                        <template v-for="route in agency.routes">
                            <template v-if="route.visible && route.shapes">
                                <l-polyline
                                            :weight="10"
                                            :lat-lngs="GtfsShapeDao.getLatLngs(route.shapes)" />
                            </template>

                        </template>
                    </template>


                    <l-marker v-for="stop in gtfs_file.stops" :lat-lng="stop.getLatLng()" v-if="gtfs_file.stopsVisible">
                        <l-popup>
                            {{ stop.stop_name }}
                        </l-popup>
                    </l-marker>
                </template>
            </template>

        </l-map>




    </div>
</template>


<style>



    .marker-route, .marker-route-selected{
        background: #00AF8C;
        border: 3px solid black;
        color: white;
        font-weight: bold;
        font-size: 1.7em;
        line-height: 1.95;
        text-align: center;
        border-radius: 30px;
    }

    .marker-route-selected{
        background: #0062B0;
    }

    .marker-route:hover{
        background: #00493A;

    }

</style>


<script lang="ts">

export default defineComponent({

    components: {
        LMap,
        LTileLayer,
        LMarker,
        LPopup,
        LPolyline,
        LIcon
    },

    props:{
        gtfs_files: {
            type: Array as PropType<GtfsDao[]>,
            required: true
        },
        trips_in_route: {
            type: Array as PropType<GtfsTripDao[]>
        },
        simulation_settings: {
            type: Object,
            required: true
        },
        visibleSimulationRoutes: {
            type: Array,
            required: true
        },
        panelSettings: {
            type: Object,
            required: true
        }
    },

    data(){
        return {
            zoom: 15,
            routeIcon: {
                iconSize: L.point([40,40]),
                iconAnchor: L.point([20,20]),

            },
            iconBus: L.icon({
                iconUrl: "/bus_icon.png",
                iconSize: [40,40],
                iconAnchor: [40,40]

            })
        }
    },

    methods: {

        getClassNameMarker: function(trip:GtfsTripDao){
            if(!this.panelSettings.tripSelected){
                return "marker-route";
            }
            return this.panelSettings.tripSelected!!.id == trip.id ? 'marker-route-selected':'marker-route' 
        },

        getLeafletRouteIcon: function(route: string): L.DivIcon{
            return L.divIcon({
                className: "route-marker",
                html: route
            })
        },


        handleMapClick(event:any) {
            // Obtener la posición del clic
            const clickedLatLng = event.latlng;

            // Obtener la posición del marcador
            const markerLatLng = this.panelSettings.tripSelected.getCurrentPosition(this.simulation_settings.datetimeSelected);

            // Calcular la distancia entre el clic y el marcador (en metros)
            const distance = clickedLatLng.distanceTo(markerLatLng);

            // Si la distancia es mayor a cierto umbral, se considera fuera del marcador
            const threshold = 50; // Umbral en metros
            if (distance > threshold) {
                this.panelSettings.tripSelected = null;
            }
        },

    },

    computed: {
        visibleStopsRoutes: function(){
            let visibleStopsRoutes = this.gtfs_files.flatMap(g => g.agencies).flatMap(a => a.routes).filter(r => r.stopsVisible).map(r => r.id);
            visibleStopsRoutes = visibleStopsRoutes.concat(this.gtfs_files.filter(gtfs => gtfs.stopsVisible).flatMap(g => g.agencies).flatMap(a => a.routes).map(r => r.id));
            return visibleStopsRoutes;
        }
    },



})
</script>