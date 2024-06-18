"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const GtfsDao_1 = require("../daos/GtfsDao");
const project_model_1 = require("../models/project.model");
const gtfsagency_model_1 = require("../models/gtfsagency.model");
const gtfsstop_model_1 = require("../models/gtfsstop.model");
const gtfsroute_model_1 = require("../models/gtfsroute.model");
const gtfscalendardates_model_1 = require("../models/gtfscalendardates.model");
const gtfstrip_model_1 = require("../models/gtfstrip.model");
const gtfsshape_model_1 = require("../models/gtfsshape.model");
const sequelize_1 = require("sequelize");
const GtfsShapeDao_1 = require("../daos/GtfsShapeDao");
const gtfsfile_model_1 = require("../models/gtfsfile.model");
const gtfsstoptime_model_1 = require("../models/gtfsstoptime.model");
const gtfscalendar_model_1 = require("../models/gtfscalendar.model");
const GtfsTripDao_1 = require("../daos/GtfsTripDao");
function downloadProject(window, idProject) {
    return __awaiter(this, void 0, void 0, function* () {
        const [project, created] = yield project_model_1.Project.findOrCreate({
            where: { id: idProject, name: "Initial Project" },
            include: {
                model: gtfsfile_model_1.GtfsFile,
                include: [
                    {
                        model: gtfsagency_model_1.GtfsAgency,
                        include: [
                            gtfsroute_model_1.GtfsRoute
                        ]
                    },
                    {
                        model: gtfsstop_model_1.GtfsStop,
                        separate: true
                    },
                    {
                        model: gtfscalendardates_model_1.GtfsCalendarDates,
                        separate: true
                    },
                    {
                        model: gtfscalendar_model_1.GtfsCalendar,
                        separate: true
                    }
                ]
            }
        });
        console.log("GTFS Cargado...");
        window.webContents.send('loaded-project');
        if (project === null || project === void 0 ? void 0 : project.gtfsFiles) {
            for (const gtfsFile of project === null || project === void 0 ? void 0 : project.gtfsFiles) {
                const DAO = GtfsDao_1.GtfsDao.fromObject(gtfsFile);
                window.webContents.send('loaded-gtfs', DAO);
            }
        }
    });
}
function downloadShapesByRoute(window, idRoute) {
    return __awaiter(this, void 0, void 0, function* () {
        const trips = yield gtfstrip_model_1.GtfsTrip.findAll({
            attributes: ['shape_id'],
            where: {
                route_id: idRoute
            }
        });
        let shapes_ids = trips.map(t => t.shape_id);
        shapes_ids = Array.from(new Set(shapes_ids));
        const shapes = yield gtfsshape_model_1.GtfsShape.findAll({
            where: {
                shape_id: {
                    [sequelize_1.Op.in]: shapes_ids
                }
            }
        });
        window.webContents.send('loaded-shapes', GtfsShapeDao_1.GtfsShapeDao.fromObjectToArray(shapes), idRoute);
    });
}
function deleteGTFS(window, idGtfs) {
    return __awaiter(this, void 0, void 0, function* () {
        const gtfsFile = yield gtfsfile_model_1.GtfsFile.findByPk(idGtfs);
        if (gtfsFile) {
            try {
                const stops = yield gtfsstop_model_1.GtfsStop.findAll({
                    attributes: ["id"],
                    where: {
                        gtfs_file_id: gtfsFile.id
                    }
                });
                const stopsId = stops.map(s => s.id);
                yield gtfsstoptime_model_1.GtfsStopTime.destroy({
                    where: {
                        stop_id: {
                            [sequelize_1.Op.in]: stopsId
                        }
                    }
                });
                yield gtfsFile.destroy();
                console.log("GTFS FILE eliminado");
                window.webContents.send('deleted-gtfs', idGtfs);
            }
            catch (error) {
                console.error(error);
            }
        }
    });
}
function downloadTripsByServices(window, servicesId) {
    return __awaiter(this, void 0, void 0, function* () {
        const trips = yield gtfstrip_model_1.GtfsTrip.findAll({
            where: {
                service_id: {
                    [sequelize_1.Op.in]: servicesId
                }
            },
            include: [
                {
                    model: gtfsroute_model_1.GtfsRoute
                },
                {
                    model: gtfsstoptime_model_1.GtfsStopTime,
                    include: [
                        gtfsstop_model_1.GtfsStop
                    ],
                    separate: true
                }
            ]
        });
        window.webContents.send("trips_by_service", GtfsTripDao_1.GtfsTripDao.fromObjectToArray(trips));
    });
}
module.exports = {
    downloadProject,
    downloadShapesByRoute,
    deleteGTFS,
    downloadTripsByServices
};
