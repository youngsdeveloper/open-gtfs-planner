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
const gtfsfile_model_1 = require("../models/gtfsfile.model");
const gtfsagency_model_1 = require("../models/gtfsagency.model");
const gtfsstop_model_1 = require("../models/gtfsstop.model");
function downloadProject(window, idProject) {
    return __awaiter(this, void 0, void 0, function* () {
        const project = yield project_model_1.Project.findOne({
            where: { id: idProject },
            include: {
                model: gtfsfile_model_1.GtfsFile,
                include: [
                    {
                        model: gtfsagency_model_1.GtfsAgency
                    },
                    {
                        model: gtfsstop_model_1.GtfsStop
                    }
                ]
            }
        });
        const DAO = GtfsDao_1.GtfsDao.fromObject(project === null || project === void 0 ? void 0 : project.gtfsFiles[0]);
        console.log(DAO.agencies[0].name);
        window.webContents.send('loaded-gtfs', DAO);
    });
}
module.exports = {
    downloadProject
};
