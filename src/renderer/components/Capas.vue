<template>
    <div>


        
        <ul uk-accordion="multiple: true">
            <li class="uk-open">
                <a class="uk-accordion-title">Capas</a>
                <div class="uk-accordion-content" >
                    <div class="uk-panel uk-panel-scrollable" style="min-height: 500px">
                        <ul class="uk-list" v-for="gtfs in gtfs_files">
                            <li>
                                <label><input class="uk-checkbox" type="checkbox" v-model="gtfs.visible"> {{ gtfs.filename }}</label>
                                <ul>
                                    <li v-for="agency in gtfs.agencies">
                                        <label><input class="uk-checkbox" type="checkbox"> {{ agency.name }}</label>
                                        <ul>
                                            <li v-for="route in agency.routes">
                                                <li><label><input class="uk-checkbox" type="checkbox"> {{ route.route_short_name }}</label></li>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            
                        </ul>
                    </div>
                    

                    <button v-on:click="importarCapa()" class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom uk-margin-small-top">
                        Importar capa
                    </button>


                </div>
            </li>
            
        </ul>
    </div>
</template>


<script>
import { GtfsDao } from '../../main/daos/GtfsDao';


export default{

    props:{
        gtfs_files: {
            type: Array
        }
    },
    methods: {
        importarCapa: function(){
            window.electronAPI.importGTFS();
        }
    },

}
</script>