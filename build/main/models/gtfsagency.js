'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class GtfsAgency extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            GtfsAgency.belongsTo(models.GtfsFile, {
                foreignKey: 'id',
                as: 'gtfs_file'
            });
        }
    }
    GtfsAgency.init({
        name: DataTypes.STRING,
        gtfs_agency_id: DataTypes.INTEGER,
        gtfs_file_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'GtfsFiles',
                key: "id"
            }
        }
    }, {
        sequelize,
        modelName: 'GtfsAgency',
    });
    return GtfsAgency;
};
