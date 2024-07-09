"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Project = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const gtfsfile_model_1 = require("./gtfsfile.model");
const simulationoptions_model_1 = require("./simulationoptions.model");
const fusedstop_model_1 = require("./fusedstop.model");
let Project = class Project extends sequelize_typescript_1.Model {
};
exports.Project = Project;
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], Project.prototype, "name", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => gtfsfile_model_1.GtfsFile),
    __metadata("design:type", Array)
], Project.prototype, "gtfsFiles", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => simulationoptions_model_1.SimulationOptions),
    __metadata("design:type", Array)
], Project.prototype, "simulationOptions", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => fusedstop_model_1.FusedStop),
    __metadata("design:type", Array)
], Project.prototype, "fusedStops", void 0);
exports.Project = Project = __decorate([
    sequelize_typescript_1.Table
], Project);
