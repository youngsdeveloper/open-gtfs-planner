import { FusedStopDao } from "../daos/FusedStopDao";
import { GtfsStopDao } from "../daos/GtfsStopDao";
import { InterpolationHelper } from "../helpers/InterpolationHelper";
import sequelize from "../models";
import { FusedStop } from "../models/fusedstop.model";
import { GtfsStop } from "../models/gtfsstop.model";




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

async function saveFusedStop(window, projectId, stop1_id, stop2_id){

  const stop1 = await GtfsStop.findByPk(stop1_id);
  const stop2 = await GtfsStop.findByPk(stop2_id);

  if(stop1 == null || stop2==null){
    return;
  }

  const stop1_DAO = GtfsStopDao.fromObject(stop1);
  const stop2_DAO = GtfsStopDao.fromObject(stop2);

  const middle = InterpolationHelper.interpolateGeodetic(stop1_DAO.getLatLng(), stop2_DAO.getLatLng(),0.5);

  const fusedStop = await FusedStop.create({
      project_id: projectId,
      stop_1_id: stop1.id,
      stop_2_id: stop2.id,
      stop_name: "Fused: " + stop1.stop_name + " + " + stop2.stop_name,
      stop_lat: middle[0],
      stop_lon: middle[1]
  });

  window.webContents.send("new_fused_stop",FusedStopDao.fromObject(fusedStop));
  window.webContents.send("end_creating_fused_stop");

}

module.exports = {
    getNearStops,
    saveFusedStop
  };