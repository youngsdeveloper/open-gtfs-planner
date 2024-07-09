import sequelize from "../models";




async function getNearStops(window, location) {

    const RADIUS = 0.5; // Radio fijo en kilómetros


    try {
      const [results] = await sequelize.query(`
         SELECT GtfsStops.id as stop_id, *,
          (6371 * acos(cos(radians(:lat)) * cos(radians(stop_lat)) * cos(radians(stop_lon) - radians(:lon)) + sin(radians(:lat)) * sin(radians(stop_lat)))) AS distance
        FROM GtfsStops
        JOIN GtfsFiles ON gtfs_file_id = GtfsFiles.id
        WHERE (6371 * acos(cos(radians(:lat)) * cos(radians(stop_lat)) * cos(radians(stop_lon) - radians(:lon)) + sin(radians(:lat)) * sin(radians(stop_lat)))) <= :radius
        ORDER BY distance ASC
        LIMIT 10
      `, {
        replacements: { lat: location.latitude, lon: location.longitude,radius: RADIUS },
      });

      window.webContents.send("stops_near", results);

    } catch (error) {
      console.error(error)
    }



}


module.exports = {
    getNearStops
  };