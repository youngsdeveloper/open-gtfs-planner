
export class GtfsShapeDao {

  id: Number;
  shape_id: string;
  shape_pt_lat: Number;
  shape_pt_lon: Number;

  shape_pt_sequence: Number;

  constructor(
    id: Number, 
    shape_id: string, 
    shape_pt_lat: Number, 
    shape_pt_lon: Number, 
    shape_pt_sequence: Number
) {
    this.id = id
    this.shape_id = shape_id
    this.shape_pt_lat = shape_pt_lat
    this.shape_pt_lon = shape_pt_lon
    this.shape_pt_sequence = shape_pt_sequence
  }  

  static fromObject(obj: any): GtfsShapeDao {
      const dao = new GtfsShapeDao(obj.id, obj.shape_id, obj.shape_pt_lat, obj.shape_pt_lon, obj.shape_pt_sequence);
      return dao;
  }

  static fromObjectToArray(obj: any): GtfsShapeDao[] {
      const data: GtfsShapeDao[] = [] as GtfsShapeDao[];
      obj.forEach(s => data.push(this.fromObject(s)));
      return data;
  }

  getLatLng():[Number,Number]{
    return [this.shape_pt_lat, this.shape_pt_lon];
  }
  static getLatLngs(shapes:GtfsShapeDao[]){
    const points = []as any[];
    shapes.forEach(s2 => {
      points.push(s2.getLatLng());
    });
    return points;
  }
}