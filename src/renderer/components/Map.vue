<template>
    <div style="width: 100%; height: 700px;">
        <l-map ref="map" :zoom="zoom" :center="[37.9915664, -1.1323996]" >
            <l-tile-layer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                layer-type="base"
                name="OpenStreetMap"
                attribution="Creado con OpenStreetMap"
            ></l-tile-layer>


            

            <template v-for="gtfs_file in gtfs_files">
                <template v-if="gtfs_file.visible">
                    
                    <template v-for="agency in gtfs_file.agencies">
                        <template v-for="route in agency.routes">
                            <template v-if="route.visible && route.shapes">
                                <l-polyline
                                            :weight="10"
                                            :lat-lngs="getLatLngsShapes(route.shapes)" />
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

            <!--

            <l-marker v-for="stop_trip in trips_in_route?.flatMap(t => t.stopTimes).flatMap(st => st.stop)"
                :lat-lng="stop_trip.getLatLng()">
        
            </l-marker>-->


            <template v-for="trip in trips_in_route">

                <l-marker v-if="visibleSimulationRoutes.includes(parseInt(trip.route_id))" :lat-lng="getLeafletLatLng(trip.getCurrentPosition(simulation_settings.datetimeSelected)!)" />
            
                <template v-if="visibleStopsRoutes.includes(parseInt(trip.route_id))" >
                    <l-marker v-for="stop_trip in trip.stopTimes.flatMap(st => st.stop)" :lat-lng="getLeafletLatLng(stop_trip.getLatLng())" />

                </template>
                
            </template>

        </l-map>

        {{ visibleStopsRoutes }}


    </div>
</template>


<script lang="ts">
import { GtfsDao } from '../../main/daos/GtfsDao';
import { GtfsShapeDao } from '../../main/daos/GtfsShapeDao';

import "leaflet/dist/leaflet.css";
import { LMap, LMarker, LPopup, LTileLayer, LPolyline, LIcon } from "@vue-leaflet/vue-leaflet";
import { GtfsTripDao } from '../../main/daos/GtfsTripDao';
import { PropType } from 'vue';
import * as L from 'leaflet';

export default{

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
        }
    },

    data(){
        return {
            zoom: 15,
            iconBus: L.icon({
                iconUrl: "/bus_icon.png",
                iconSize: [40,40],
                iconAnchor: [40,40]

            })
        }
    },

    methods: {
        getLatLngsShapes: function(shapes:GtfsShapeDao[]){
            return GtfsShapeDao.getLatLngs(shapes);
        },

        getLeafletLatLng: function(position: number[]){
            return L.latLng(position[0], position[1]);
        }
    },

    computed: {
        visibleSimulationRoutes: function(){
            let visibleSimulationRoutes = this.gtfs_files.flatMap(g => g.agencies).flatMap(a => a.routes).filter(r => r.simulationVisible).map(r => r.id);
            visibleSimulationRoutes = visibleSimulationRoutes.concat(this.gtfs_files.filter(gtfs => gtfs.simulationVisible).flatMap(g => g.agencies).flatMap(a => a.routes).map(r => r.id));
            return visibleSimulationRoutes;
        },
        visibleStopsRoutes: function(){
            let visibleStopsRoutes = this.gtfs_files.flatMap(g => g.agencies).flatMap(a => a.routes).filter(r => r.stopsVisible).map(r => r.id);
            visibleStopsRoutes = visibleStopsRoutes.concat(this.gtfs_files.filter(gtfs => gtfs.stopsVisible).flatMap(g => g.agencies).flatMap(a => a.routes).map(r => r.id));
            return visibleStopsRoutes;
        }
    }

}
</script>