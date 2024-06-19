import moment from "moment";

export class GtfsCalendarDao {

    id: Number;
    service_id: string;
    start_date: Date;
    end_date: Date;
    gtfs_file_id: Number;

    monday: Number;
    tuesday: Number;
    wednesday: Number;
    thursday: Number;
    friday: Number;
    saturday: Number;
    sunday: Number;


    constructor(
        id: Number,
        service_id: string,
        start_date: Date,
        end_date: Date,
        gtfs_file_id: Number,
        monday: Number,
        tuesday: Number,
        wednesday: Number,
        thursday: Number,
        friday: Number,
        saturday: Number,
        sunday: Number
    ) {
        this.id = id
        this.service_id = service_id
        this.start_date = start_date
        this.end_date = end_date
        this.gtfs_file_id = gtfs_file_id
        this.monday = monday
        this.tuesday = tuesday
        this.wednesday = wednesday
        this.thursday = thursday
        this.friday = friday
        this.saturday = saturday
        this.sunday = sunday
    }
    
    getStartDate(){
        return moment(this.start_date).startOf('day');
    }

    getEndDate(){
        return moment(this.end_date).endOf('day');
    }

    static fromObject(obj: any): GtfsCalendarDao {
        return new GtfsCalendarDao(obj.id, obj.service_id, obj.start_date, obj.end_date, obj.gtfs_file_id, obj.monday, obj.tuesday, obj.wednesday, obj.thursday, obj.friday, obj.saturday, obj.sunday);
    }

    static fromObjectToArray(obj: any): GtfsCalendarDao[] {
        const data: GtfsCalendarDao[] = [];
        obj.forEach(s => data.push(this.fromObject(s)));
        return data;
    }

    isDay(dayOfWeek){

        switch(dayOfWeek){
            case 0: return this.sunday==1;
            case 1: return this.monday == 1;
            case 2: return this.tuesday == 1;
            case 3: return this.wednesday == 1;
            case 4: return this.thursday == 1;
            case 5: return this.friday == 1;
            case 6: return this.saturday == 1;
            default: false;
        }


    }
}