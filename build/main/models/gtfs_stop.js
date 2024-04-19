"use strict";
module.exports = (sequelize, DataTypes) => {
    const GtfsStops = sequelize.define('gtfs_stop', {
        stop_id: {
            type: DataTypes.INTEGER
        },
        stop_name: {
            type: DataTypes.STRING
        },
        stop_lat: {
            type: DataTypes.DOUBLE
        },
        stop_lon: {
            type: DataTypes.DOUBLE
        },
    }, {
        tableName: 'gtfs_stops',
        timestamps: true,
        underscored: true,
        createdAt: false,
        updatedAt: false,
    });
    return GtfsStops;
};
