<template>
    <div class="simulationBar">

        
        <div class="input">

            <label for="fechaSimulacion">Fecha Simulación: </label>
            <input id="fechaSimulacion" class="uk-input" type="date" v-model="dateSelected">
            <input id="horaSimulacion" class="uk-input" type="time" v-model="timeSelected">
            <button class="speedButton" v-on:click="speedIndex = (speedIndex + 1) % speedPosibilities.length">
                {{speedPosibilities[speedIndex]}}x
            </button>
            <a class="services"  uk-toggle="target: #modal-services">{{ services.length }} servicio<span v-if="services.length>1">s</span></a>

            <!-- This is the modal -->
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
                                {{ service.service_id }}
                            </li>
                        </ul>


                    </div>

                    <button class="uk-modal-close-default" type="button" uk-close></button>
                </div>
            </div>

            <span class="buttons_play">
                
                <img src="/play-button.png" alt="">
                <img src="/pause-button.png" alt="">

            </span>
        </div>

    </div>
</template>


<script lang="ts">
import { GtfsCalendarDatesDao } from '../../main/daos/GtfsCalendarDatesDao';
import { GtfsDao } from '../../main/daos/GtfsDao';
import { GtfsServiceDao } from '../../main/daos/GtfsServiceDao';

export default{


    props:{
        gtfs_files: {
            type: Array,
        }
    },

    data(){
        return {
            dateSelected: this.getDate(new Date().toLocaleDateString()),
            timeSelected: new Date().toTimeString().split(' ')[0],
            speedIndex: 0,
            speedPosibilities: [1,2,3,5],
        }
    },

    computed: {
        services(){
            const services =  [] as GtfsServiceDao[];

            for(const _gtfs_file of this.gtfs_files!!){
                const gtfs_file = GtfsDao.fromObject(_gtfs_file);
                const calendarDates = gtfs_file.calendarDates.filter(c => this.getDate(c.date.toLocaleDateString()) == this.dateSelected && c.exception_type==1)

                calendarDates.forEach(c => {
                    services.push(new GtfsServiceDao(c.service_id, c.gtfs_file_id, c));
                })
            }
            return services;
        }
    },

    methods: {
        getDate: function(date:String){
            let year = date.split("/")[2];
            let month = date.split("/")[1].padStart(2,"0");
            let day = date.split("/")[0].padStart(2, '0');

            return `${year}-${month}-${day}`;

        }
    }

}
</script>

<style scoped>

.simulationBar{
    padding: 15px 0px;
    background: linear-gradient(#78c89a,#39b29d);
    width: 80%;
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

.simulationBar .buttons_play img:hover{
    filter: grayscale(30%);
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