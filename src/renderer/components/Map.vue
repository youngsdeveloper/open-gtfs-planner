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
                    <l-marker v-for="stop in gtfs_file.stops" :lat-lng="stop.getLatLng()">
                
                        <l-popup>
                            {{ stop.stop_name }}
                        </l-popup>

                    </l-marker>
                    
                    <template v-for="agency in gtfs_file.agencies">
                        <template v-for="route in agency.routes">
                            <template v-if="route.visible && route.shapes">
                                <l-polyline 
                                            :weight="10"
                                            :lat-lngs="getLatLngsShapes(route.shapes)" />
                            </template>

                        </template>
                    </template>
                </template>
                


            </template>

        </l-map>
    </div>
</template>


<script lang="ts">
import { GtfsDao } from '../../main/daos/GtfsDao';
import { GtfsShapeDao } from '../../main/daos/GtfsShapeDao';

import "leaflet/dist/leaflet.css";
import { LMap, LMarker, LPopup, LTileLayer, LPolyline } from "@vue-leaflet/vue-leaflet";

export default{

    components: {
        LMap,
        LTileLayer,
        LMarker,
        LPopup,
        LPolyline
    },

    props:{
        gtfs_files: {
            type: Array,
        }
    },

    data(){
        return {
            zoom: 15
        }
    },

    methods: {
        getLatLngsShapes: function(shapes){
            return GtfsShapeDao.getLatLngs(shapes);
        }
    }

}
</script>