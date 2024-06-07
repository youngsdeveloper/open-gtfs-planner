<template>
    <div>


        
        <ul uk-accordion="multiple: true">
            <li class="uk-open">
                <a class="uk-accordion-title">Capas</a>
                <div class="uk-accordion-content">
                    <div class="uk-panel uk-panel-scrollable">
                        <ul class="uk-list" v-if="gtfs.filename">
                            <li >
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
                                    <!--<li>
                                        <label><input class="uk-checkbox" type="checkbox"> Category 2.3</label>
                                        <ul>
                                            <li><label><input class="uk-checkbox" type="checkbox"> Category 2.3.1</label></li>
                                            <li><label><input class="uk-checkbox" type="checkbox"> Category 2.3.2</label></li>
                                        </ul>
                                    </li>
                                    <li><label><input class="uk-checkbox" type="checkbox"> Category 2.4</label></li>-->
                                </ul>
                            </li>
                            
                        </ul>
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
</template>


<script>
import { GtfsDao } from '../../main/daos/GtfsDao';


export default{

    props:{
        gtfs: GtfsDao
    },
    methods: {
        importarCapa: function(){
            window.electronAPI.importGTFS();
        }
    },

}
</script>