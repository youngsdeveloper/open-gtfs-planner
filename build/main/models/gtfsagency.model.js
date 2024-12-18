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
exports.GtfsAgency = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const gtfsfile_model_1 = require("./gtfsfile.model");
const gtfsroute_model_1 = require("./gtfsroute.model");
let GtfsAgency = class GtfsAgency extends sequelize_typescript_1.Model {
};
exports.GtfsAgency = GtfsAgency;
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], GtfsAgency.prototype, "name", void 0);
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], GtfsAgency.prototype, "gtfs_agency_id", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => gtfsfile_model_1.GtfsFile),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], GtfsAgency.prototype, "gtfs_file_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => gtfsfile_model_1.GtfsFile),
    __metadata("design:type", gtfsfile_model_1.GtfsFile)
], GtfsAgency.prototype, "gtfsFile", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => gtfsroute_model_1.GtfsRoute),
    __metadata("design:type", Array)
], GtfsAgency.prototype, "routes", void 0);
exports.GtfsAgency = GtfsAgency = __decorate([
    sequelize_typescript_1.Table
], GtfsAgency);
