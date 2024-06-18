export class InterpolationHelper{

    static toRadians(degrees) {
      return degrees * Math.PI / 180;
    }


    static toDegrees(radians) {
      return radians * 180 / Math.PI;
    }

    static interpolateGeodetic(point1, point2, fraction):[number,number]{
        const lat1 = this.toRadians(point1[0]);
        const lon1 = this.toRadians(point1[1]);
        const lat2 = this.toRadians(point2[0]);
        const lon2 = this.toRadians(point2[1]);

        const d = 2 * Math.asin(Math.sqrt(Math.sin((lat2 - lat1) / 2) ** 2 + 
                   Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2));

        const A = Math.sin((1 - fraction) * d) / Math.sin(d);
        const B = Math.sin(fraction * d) / Math.sin(d);

        const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
        const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
        const z = A * Math.sin(lat1) + B * Math.sin(lat2);

        const lat = Math.atan2(z, Math.sqrt(x ** 2 + y ** 2));
        const lon = Math.atan2(y, x);

        return [this.toDegrees(lat),this.toDegrees(lon)];
      }
}