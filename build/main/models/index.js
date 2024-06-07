'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require('../config/config.js');
const db = {};
const sequelize = new Sequelize(config.database, config.username, config.password, config);
fs
    .readdirSync(__dirname)
    .filter(file => {
    return (file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.js' &&
        file.indexOf('.test.js') === -1);
})
    .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    console.log("Tipo: " + typeof model);
    db[model.name] = model;
});
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        console.log(`Associating ${modelName}`);
        db[modelName].associate(db);
    }
    console.log(`Model ${modelName} associations:`, db[modelName].associations);
});
test();
db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;
function test() {
    return __awaiter(this, void 0, void 0, function* () {
        const project = yield db.Project.findAll({
            include: ["gtfsFiles"]
        });
        console.log(project);
        console.log(project[0].gtfsFiles);
    });
}
