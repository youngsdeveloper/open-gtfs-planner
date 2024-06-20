<template>
    <div class="simulationBar">

        
        <div class="input">

            <label for="fechaSimulacion">Fecha Simulación: </label>
            <input id="fechaSimulacion" class="uk-input" type="date" v-model="simulationSettings.dateSelected">
            <input id="horaSimulacion" class="uk-input" type="time" v-model="simulationSettings.timeSelected">
            <button class="speedButton" v-on:click="speedIndex = (speedIndex + 1) % speedPosibilities.length">
                {{speedPosibilities[speedIndex]}}x
            </button>
            <a class="services" uk-toggle="target: #modal-services">{{ services.length }} servicio<span v-if="services.length>1">s</span></a>

            <!-- Modal Servicios -->
            <div id="modal-services" uk-modal>
                <div class="uk-modal-dialog uk-modal-body">
                    <div class="uk-modal-header">
                        <h2 class="uk-modal-title">
                            {{ services.length }} servicio<span v-if="services.length>1">s</span>
                        </h2>
                    </div>
                    <div class="uk-modal-body">

                        <ul class="uk-list uk-list-divider">

                            <li v-for="service in services">
                                {{ service.service_id }} -- {{ service.gtfs_file_name }}
                            </li>
                        </ul>


                    </div>

                    <button class="uk-modal-close-default" type="button" uk-close></button>
                </div>
            </div>

            <span class="buttons_play">
                
                <img v-bind:class="{'selected_button': isPlaying}" src="/play-button.png" v-on:click="playSimulation()" alt="">
                <img v-bind:class="{'selected_button': !isPlaying}" src="/pause-button.png" v-on:click="pauseSimulation()" alt="">

            </span>
        </div>

    </div>
</template>


<script lang="ts">
import { GtfsCalendarDatesDao } from '../../main/daos/GtfsCalendarDatesDao';
import { GtfsDao } from '../../main/daos/GtfsDao';
import { GtfsServiceDao } from '../../main/daos/GtfsServiceDao';
import { PropType } from 'vue';


type IntervalID = ReturnType<typeof setInterval>;

export default{


    props:{
        gtfs_files: {
            type: Array,
        },
        simulationSettings: {
            type: Object,
            required: true
        },
        services: {
            type: Array as PropType<GtfsServiceDao[]>,
            required: true
        }
    },

    data(){
        return {
            speedIndex: 0,
            speedPosibilities: [1,2,3,5],
            intervalSimulation: null as IntervalID | null,
            isPlaying: false
        }
    },

    methods: {
        getDate: function(date:String){
            let year = date.split("/")[2];
            let month = date.split("/")[1].padStart(2,"0");
            let day = date.split("/")[0].padStart(2, '0');

            return `${year}-${month}-${day}`;
        },
        playSimulation: function(){
            if(this.isPlaying){
                return;
            }
            this.isPlaying = true;
            this.intervalSimulation = setInterval(this.updateTime, 250);
        },
        pauseSimulation: function(){
            if(this.intervalSimulation!=null){
                clearInterval(this.intervalSimulation)
                this.isPlaying = false;
            }
        },
        updateTime: function(){
            const [hours, mins,secs] = this.simulationSettings.timeSelected.split(':').map(Number);
            const datetimeSelected = new Date(this.simulationSettings.dateSelected);
            datetimeSelected.setHours(hours);
            datetimeSelected.setMinutes(mins);
            datetimeSelected.setSeconds(secs+5*this.speedPosibilities[this.speedIndex]);

            // Formatear horas y minutos con dos dígitos
            const formattedHours = String(datetimeSelected.getHours()).padStart(2, '0');
            const formattedMinutes = String(datetimeSelected.getMinutes()).padStart(2, '0');
            const formattedSecs = String(datetimeSelected.getSeconds()).padStart(2, '0');

            this.simulationSettings.timeSelected = `${formattedHours}:${formattedMinutes}:${formattedSecs}`;
            this.simulationSettings.datetimeSelected = datetimeSelected
        }
    },

    mounted(){

        
    }

}
</script>

<style scoped>

.simulationBar{
    padding: 15px 0px;
    background: linear-gradient(#78c89a,#39b29d);
    width: 95%;
    border-radius: 200px;

    margin-bottom: 40px !important;
    text-align: center;
    margin: auto;
}

.simulationBar label{
    font-weight: bold;
    color: rgb(255, 255, 255);
}
.simulationBar .input input{
    width: 150px;
}

.simulationBar #fechaSimulacion{
    margin-left: 10px;
}

.simulationBar .buttons_play {
    color: white;
    margin-left: 30px;

}

.simulationBar .buttons_play img{
    width: 30px;
    margin-left: 5px;
}


.simulationBar .buttons_play .selected_button{
    filter: grayscale(90%);
}
.simulationBar .buttons_play img:hover{
    filter: grayscale(30%);
    cursor: pointer;
}

.simulationBar .services{
    margin-left: 20px;
    color: white;
}

.simulationBar .speedButton{
    height: 40px;
    background: white;
    border: 1px solid #e5e5e5;
    padding: 0 20px;
    color: #666;
    font-weight: bold;
    overflow: none;
}

.simulationBar .speedButton:hover{
    background: rgb(207, 207, 207);
}
</style>