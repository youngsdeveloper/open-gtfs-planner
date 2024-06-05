'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GtfsStops', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      gtfs_stop_id: {
        type: Sequelize.INTEGER
      },
      stop_name: {
        type: Sequelize.STRING
      },
      stop_lat: {
        type: Sequelize.DOUBLE
      },
      stop_lon: {
        type: Sequelize.DOUBLE
      },
      agency_id: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('GtfsStops');
  }
};