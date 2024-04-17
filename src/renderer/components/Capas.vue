<template>
    <div>
        <ul uk-accordion="multiple: true">
            <li class="uk-open">
                <a class="uk-accordion-title">Capas</a>
                <div class="uk-accordion-content">
                    <div v-for="capa in capas">
                        <label><input class="uk-checkbox" type="checkbox" checked> 
                        {{ capa }}
                        </label>
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

export default{

    data(){
        return {
            capas: []
        }
    },
    methods: {
        importarCapa: function(){
            window.electronAPI.importGTFS();
        }
    },

    mounted(){

        window.electronAPI.addListener("nueva-capa", (event, capa) => {
            this.capas.push(capa);
        })
        
    }
}
</script>