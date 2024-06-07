export class GtfsAgencyDao {
    
    name: string
    id: Number;

    constructor(id:number,name:string){
        this.id = id;
        this.name = name;
    }


    static fromObject(obj: any): GtfsAgencyDao {
        return new GtfsAgencyDao(obj.id, obj.name);
    }

    static fromObjectToArray(obj: any): GtfsAgencyDao[] {
        const data:GtfsAgencyDao[] = [];
        obj.forEach(s => data.push(this.fromObject(s)));
        return data;
    }
}