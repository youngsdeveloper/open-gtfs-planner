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
exports.GtfsFile = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const project_model_1 = require("./project.model");
const gtfsagency_model_1 = require("./gtfsagency.model");
const gtfsstop_model_1 = require("./gtfsstop.model");
const gtfscalendardates_model_1 = require("./gtfscalendardates.model");
const gtfsshape_model_1 = require("./gtfsshape.model");
const gtfscalendar_model_1 = require("./gtfscalendar.model");
let GtfsFile = class GtfsFile extends sequelize_typescript_1.Model {
};
exports.GtfsFile = GtfsFile;
__decorate([
    sequelize_typescript_1.Column,
    __metadata("design:type", String)
], GtfsFile.prototype, "filename", void 0);
__decorate([
    (0, sequelize_typescript_1.ForeignKey)(() => project_model_1.Project),
    sequelize_typescript_1.Column,
    __metadata("design:type", Number)
], GtfsFile.prototype, "project_id", void 0);
__decorate([
    (0, sequelize_typescript_1.BelongsTo)(() => project_model_1.Project),
    __metadata("design:type", project_model_1.Project)
], GtfsFile.prototype, "project", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => gtfsagency_model_1.GtfsAgency, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], GtfsFile.prototype, "agencies", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => gtfsstop_model_1.GtfsStop, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], GtfsFile.prototype, "stops", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => gtfscalendar_model_1.GtfsCalendar, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], GtfsFile.prototype, "calendar", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => gtfscalendardates_model_1.GtfsCalendarDates, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], GtfsFile.prototype, "calendarDates", void 0);
__decorate([
    (0, sequelize_typescript_1.HasMany)(() => gtfsshape_model_1.GtfsShape, {
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
    }),
    __metadata("design:type", Array)
], GtfsFile.prototype, "shapes", void 0);
exports.GtfsFile = GtfsFile = __decorate([
    sequelize_typescript_1.Table
], GtfsFile);
