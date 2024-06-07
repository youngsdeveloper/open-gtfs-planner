'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class GtfsStop extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    GtfsStop.init({
        gtfs_stop_id: DataTypes.INTEGER,
        stop_name: DataTypes.STRING,
        stop_lat: DataTypes.DOUBLE,
        stop_lon: DataTypes.DOUBLE,
        gtfs_file_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'GtfsFiles',
                key: "id"
            }
        }
    }, {
        sequelize,
        modelName: 'GtfsStop',
    });
    return GtfsStop;
};
