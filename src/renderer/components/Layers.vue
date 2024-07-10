<template>
    <div>


        
        <ul uk-accordion="multiple: true">
            <li class="uk-open">
                <a class="uk-accordion-title">Capas</a>
                <div class="uk-accordion-content" >
                    <div class="uk-panel uk-panel-scrollable" style="min-height: 700px">
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
                                    <li>
                                        <label><input class="uk-checkbox" type="checkbox" v-model="gtfs.stopsVisible"> Paradas </label>
                                    </li>
                                    <li>
                                        <label><input class="uk-checkbox" type="checkbox" v-model="gtfs.simulationVisible"> Simulación </label>
                                    </li>

                                    <li v-for="agency in gtfs.agencies">
                                        <label><input class="uk-checkbox" type="checkbox"> {{ agency.name }}</label>
                                        <ul>
                                            <li v-for="route in agency.routes.sort( (a,b) => parseInt(a.getRouteName())-parseInt(b.getRouteName()) )">
                                                <li>
                                                    <label>
                                                        <input @change="downloadShape(route)" class="uk-checkbox" v-model="route.visible" type="checkbox"> {{ route.getRouteName() }}
                                                    </label>
                                                    <ul style="margin-top: 0; margin-bottom: 0;">
                                                        <li>
                                                            <label><input class="uk-checkbox" type="checkbox" v-model="route.stopsVisible"> Paradas </label>
                                                        </li>
                                                        <li>
                                                            <label><input class="uk-checkbox" type="checkbox" v-model="route.simulationVisible"> Simulación </label>
                                                        </li>
                                                    </ul>
                                                </li>
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
                                <div v-if="!fromNap">
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
                                                <button v-on:click="fromNap=true" class="uk-button uk-button-secondary  uk-button-small">Buscar en NAP</button>


                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-else>



                                    <h2 class="uk-modal-title">
                                        <div>
                                            <button class="uk-icon-button" uk-icon="arrow-left" v-on:click="fromNap=!fromNap"></button>
                                        </div>
                                        Importar desde el NAP
                                    </h2>

                                    <div class="uk-inline">
                                        <span class="uk-form-icon" uk-icon="icon: search"></span>

                                        <input class="uk-input" v-model="q_nap_mitma">

                                    </div>

                                    <div v-if="!result_nap_mitma">
                                        <span uk-spinner style="margin-top:20px"></span>
                                    </div>
                                    <div v-else style="max-height: 350px;overflow-y: auto;margin-top:20px">
                                        <table class="uk-table uk-table-justify uk-table-divider" >
                                            <thead>
                                                <tr>
                                                    <th class="uk-width-small">nombre</th>
                                                    <th>Descripción</th>
                                                    <th>Acciones</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="conjuntoDato in result_nap_mitma">
                                                    <td>{{ conjuntoDato.nombre }}</td>
                                                    <td>{{ conjuntoDato.descripcion }}</td>
                                                    <td>
                                                        <button v-on:click="importGTFSFromNap(conjuntoDato)" class="uk-button uk-button-default" type="button">
                                                            Importar
                                                        </button>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
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
import { toRaw } from '@vue/reactivity';

export default{

    data(){
        return {
            loadingImporting: false,
            loadingImportingStatus: 0,
            dialogImportOpen: false,
            fromNap: false,
            nap_mitma_data: null,
            q_nap_mitma: ''
        }
    },

    props:{
        gtfs_files: {
            type: Array,
        }
    },

    watch: {
        fromNap: function(){
            if(this.fromNap){
                this.listNAP();

            }
        }
    },

    computed: {
        result_nap_mitma: function(){
            if(!this.nap_mitma_data){
                return null;
            }
            return this
                    .nap_mitma_data.conjuntosDatoDto
                    .filter(d => d.nombre.toLowerCase().includes(this.q_nap_mitma.toLowerCase()) || d.descripcion.toLowerCase().includes(this.q_nap_mitma.toLowerCase()));
        }
    },

    methods: {
        importarCapa: function(){
            window.electronAPI.importGTFS();
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
        },

        listNAP: async function(){
            window.electronAPI.downloadGTFSListNap();
        },


        importGTFSFromNap: async function(conjuntoDato){
            
            const cjto = toRaw(conjuntoDato);
            const fichero = cjto.ficherosDto.filter(f => f.tipoFicheroNombre == "GTFS").at(0)

            if(fichero){
                window.electronAPI.downloadGTFSNap(cjto.nombre, fichero.ficheroId)
            }else{
                UIkit.modal.alert("No se ha encontrado un fichero GTFS válido para este conjunto de datos");
            }
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


        window.electronAPI.addListener("nap_mitma_data", (event, data)=>{
            this.nap_mitma_data = data;
        })
        
        window.electronAPI.addListener("end-loading-gtfs", ()=>{


            UIkit.modal(ctx.$refs.modal_importar).hide();
            ctx.loadingImporting = false;
            ctx.loadingImportingStatus = 0;

        });
    }

}
</script>