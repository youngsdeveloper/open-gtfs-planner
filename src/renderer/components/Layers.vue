<template>
    <div>


        
        <ul uk-accordion="multiple: true">
            <li class="uk-open">
                <a class="uk-accordion-title">Capas</a>
                <div class="uk-accordion-content" >
                    <div class="uk-panel uk-panel-scrollable" style="min-height: 500px">
                        <ul class="uk-list" v-for="gtfs in gtfs_files">
                            <li>
                                <label>
                                    
                                    <span>
                                        <input class="uk-checkbox" type="checkbox" v-model="gtfs.visible">
                                        {{ gtfs.filename }}
                                    </span>
                                    <span>
                                        <div class="uk-inline" style="float: right;">
                                            <a href="" class="uk-button uk-icon-link" style="line-height: 0;" uk-icon="more"></a>


                                            <div uk-dropdown="mode: click">
                                                <div style="text-align: center;">
                                                    {{ gtfs.filename }}
                                                    <hr class="uk-divider-small">

                                                </div>
                                                <button class="uk-button uk-button-danger" v-on:click="eliminarGTFS(gtfs)">
                                                    <span uk-icon="trash"></span>
                                                    Eliminar
                                                </button>

                                            </div>
                                        </div>

                                    </span>

                                </label>
                                <ul>
                                    <li v-for="agency in gtfs.agencies">
                                        <label><input class="uk-checkbox" type="checkbox"> {{ agency.name }}</label>
                                        <ul>
                                            <li v-for="route in agency.routes">
                                                <li><label><input   @change="downloadShape(route)" class="uk-checkbox" v-model="route.visible" type="checkbox"> {{ route.route_short_name }}</label></li>
                                            </li>
                                        </ul>
                                    </li>
                                </ul>
                            </li>
                            
                        </ul>
                    </div>
                    

                    <a href="#modal-importar" uk-toggle class="uk-button uk-button-primary uk-width-1-1 uk-margin-small-bottom uk-margin-small-top">
                        Importar capa
                    </a>


                    <div id="modal-importar"  ref="modal_importar" class="uk-flex-top" uk-modal>
                        <div class="uk-modal-dialog uk-modal-body uk-margin-auto-vertical">

                            <button class="uk-modal-close-default" type="button" uk-close></button>

                            <div v-if="!loadingImporting">
                                <h2 class="uk-modal-title">
                                    <span uk-icon="upload"></span>
                                    Importa archivos GTFS
                                </h2>

                                <p>
                                    Puedes importar tus archivos GTFS desde archivos en tu dispositivo o bien
                                    puedes descargar directamente archivos GTFS desde repositorios de OpenData.
                                </p>

                                <div class="uk-child-width-expand@s uk-text-center" uk-grid>

                                    <div>
                                        <div class="uk-card uk-card-default uk-card-body">
                                            <h3 class="uk-card-title">Desde este PC...</h3>
                                            <p>
                                                Selecciona una carpeta con todos los ficheros GTFS.
                                            </p>
                                            <button v-on:click="importarCapa()" class="uk-button uk-button-secondary  uk-button-small">Importar GTFS</button>


                                        </div>
                                    </div>
                                    <div>
                                        <div class="uk-card uk-card-default uk-card-body">
                                            <h3 class="uk-card-title">Punto de acceso nacional</h3>
                                            <img src='/logonap.svg' alt="Logo NAP Mitma" />
                                            <p>
                                                Utiliza el repositorio del NAP para buscar GTFS Públicos de España
                                            </p>
                                            <button disabled class="uk-button uk-button-secondary  uk-button-small">Buscar en NAP</button>


                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else-if="loadingImporting" style="text-align: center;">
                                <h2 class="uk-modal-title">
                                    <span uk-icon="upload"></span>
                                    Importando GTFS...
                                </h2>

                                <p>
                                    Espera un momento a que se complete la importación.
                                </p>

                                <progress id="js-progressbar" class="uk-progress" :value="loadingImportingStatus" max="100"></progress>
                            </div>

                            

                        </div>
                    </div>



                </div>
            </li>
            
        </ul>
    </div>
</template>


<script>
import { GtfsDao } from '../../main/daos/GtfsDao';

export default{

    data(){
        return {
            loadingImporting: false,
            loadingImportingStatus: 0,
            dialogImportOpen: false
        }
    },

    props:{
        gtfs_files: {
            type: Array,
        }
    },

    methods: {
        importarCapa: function(){
            window.electronAPI.importGTFS();
            console.log("Hola!");
        },
        downloadShape: function(route){
            if(route.visible && route.shapes.length==0){
                window.electronAPI.downloadShapesByRoute(route.id);
            }
        },
        eliminarGTFS: function(gtfs){
            UIkit.modal.confirm(`Estas a punto de eliminar el GTFS ${gtfs.filename}. Esta acción es irreversible. ¿Estás seguro?`).then(function() {
                window.electronAPI.deleteGtfs(gtfs.id);
            });
        }
    },

    mounted(){

        var ctx = this;

        window.electronAPI.addListener("start-loading-gtfs", ()=>{
            ctx.loadingImporting = true;
        });


        window.electronAPI.addListener("update-loading-gtfs", (event, value)=>{
            ctx.loadingImportingStatus = value;
        });

        window.electronAPI.addListener("update-loading-gtfs", (event, value)=>{
            ctx.loadingImportingStatus = value;
        });

        
        window.electronAPI.addListener("end-loading-gtfs", ()=>{

            ctx.loadingImporting = false;

            UIkit.modal(ctx.$refs.modal_importar).hide();

        });
    }

}
</script>