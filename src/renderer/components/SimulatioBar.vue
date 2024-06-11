<template>
    <div class="simulationBar">

        
        <div class="input">

            <label for="fechaSimulacion">Fecha Simulación: </label>
            <input id="fechaSimulacion" class="uk-input" type="date" v-model="simulationSettings.dateSelected">
            <input id="horaSimulacion" class="uk-input" type="time" v-model="simulationSettings.timeSelected">
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
                                {{ service.service_id }} -- {{ service.gtfs_file_name }}
                            </li>
                        </ul>


                    </div>

                    <button class="uk-modal-close-default" type="button" uk-close></button>
                </div>
            </div>

            <span class="buttons_play">
                
                <img src="/play-button.png" v-on:click="playSimulation()" alt="">
                <img src="/pause-button.png" v-on:click="pauseSimulation()" alt="">

            </span>
        </div>

    </div>
</template>


<script lang="ts">
import { GtfsCalendarDatesDao } from '../../main/daos/GtfsCalendarDatesDao';
import { GtfsDao } from '../../main/daos/GtfsDao';
import { GtfsServiceDao } from '../../main/daos/GtfsServiceDao';


type IntervalID = ReturnType<typeof setInterval>;

export default{


    props:{
        gtfs_files: {
            type: Array,
        },
        simulationSettings: {
            type: Object,
            required: true
        }
    },

    data(){
        return {
            speedIndex: 0,
            speedPosibilities: [1,2,3,5],
            intervalSimulation: null as IntervalID | null
        }
    },

    computed: {
        services(){
            const services =  [] as GtfsServiceDao[];

            for(const _gtfs_file of this.gtfs_files!!){
                const gtfs_file = GtfsDao.fromObject(_gtfs_file);
                const calendarDates = gtfs_file.calendarDates.filter(c => this.getDate(c.date.toLocaleDateString()) == this.simulationSettings.dateSelected && c.exception_type==1)

                calendarDates.forEach(c => {
                    services.push(new GtfsServiceDao(c.service_id, c.gtfs_file_id, gtfs_file.filename));
                })

                for(const rule of gtfs_file.calendar){

                    let localNow = new Date(this.simulationSettings.dateSelected);
                        let dayOfWeek = localNow.getDay();

                    if(rule.isDay(dayOfWeek)){ // Cumple con el dia  de la semana

                        let localStartDate = new Date(this.getDate(rule.start_date.toLocaleDateString()))
                        let localEndDate = new Date(this.getDate(rule.end_date.toLocaleDateString())) 

                        if(localNow > localStartDate && localNow<localEndDate){ // Esta en el rango de fechas
                            services.push(new GtfsServiceDao(rule.service_id, rule.gtfs_file_id, gtfs_file.filename));
                        }
                    }
                }
            }
            return services;
        }
    },

    watch: {
        services(newServices: GtfsServiceDao[], old){
            const servicesId = newServices.map( s => s.service_id);
            window.electronAPI.downloadTripsByServices(servicesId);
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
            this.intervalSimulation = setInterval(this.updateTime, 500);
        },
        pauseSimulation: function(){
            if(this.intervalSimulation!=null){
                clearInterval(this.intervalSimulation)
            }
        },
        updateTime: function(){
            const [hours, mins] = this.simulationSettings.timeSelected.split(':').map(Number);
            const date = new Date();
            date.setHours(hours);
            date.setMinutes(mins + 1); // Le sumamos 2 minutos cada segundo

            // Formatear horas y minutos con dos dígitos
            const formattedHours = String(date.getHours()).padStart(2, '0');
            const formattedMinutes = String(date.getMinutes()).padStart(2, '0');

            this.simulationSettings.timeSelected = `${formattedHours}:${formattedMinutes}:00`;
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