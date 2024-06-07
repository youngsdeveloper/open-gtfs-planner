'use strict';

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
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    console.log("Tipo: " + typeof model)
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

async function test(){
  const project = await db.Project.findAll({
      include: ["gtfsFiles"]
  });
  console.log(project);
  console.log(project[0].gtfsFiles);
}