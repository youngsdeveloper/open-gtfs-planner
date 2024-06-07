'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class GtfsFile extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            GtfsFile.hasMany(models.GtfsStop, {
                foreignKey: 'gtfs_file_id',
                as: 'stops'
            });
            GtfsFile.hasMany(models.GtfsAgency, {
                foreignKey: 'gtfs_file_id',
                as: 'agencies'
            });
            console.log(models.Project);
            GtfsFile.belongsTo(models.Project, {
                foreignKey: 'id',
            });
        }
    }
    GtfsFile.init({
        fileName: DataTypes.STRING,
        project_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'Projects',
                key: "id"
            }
        }
    }, {
        sequelize,
        modelName: 'GtfsFile',
    });
    return GtfsFile;
};
