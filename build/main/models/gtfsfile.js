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
            /*
            this.hasMany(models.GtfsStop, {
              foreignKey: 'gtfs_file_id',
              as: 'stops'
            });
            this.hasMany(models.GtfsAgency, {
              foreignKey: 'gtfs_file_id',
              as: 'agencies'
            });*/
            GtfsFile.belongsTo(models.Project, {
                foreignKey: 'project_id', // Especifica el foreignKey para la asociación
                as: 'project'
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
