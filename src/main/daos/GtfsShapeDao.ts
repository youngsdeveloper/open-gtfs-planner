
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
      return new GtfsShapeDao(obj.id, obj.shape_id, obj.shape_pt_lat, obj.shape_pt_lon, obj.shape_pt_sequence);
  }

  static fromObjectToArray(obj: any): GtfsShapeDao[] {
      const data: GtfsShapeDao[] = [];
      obj.forEach(s => data.push(this.fromObject(s)));
      return data;
  }

  getLatLng():[Number,Number]{
    return [this.shape_pt_lat, this.shape_pt_lon];
  }
  static getLatLngs(shapes:GtfsShapeDao[]){
    console.log(shapes);
    const points = []as any[];
    shapes.forEach(s2 => {
      points.push(s2.getLatLng());
    });
    return points;
  }
}