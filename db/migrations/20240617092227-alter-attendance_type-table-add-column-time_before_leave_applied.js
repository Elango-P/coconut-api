'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("attendance_type");
    if (tableDefinition && !tableDefinition["cutoff_time"]) {
      await queryInterface.addColumn("attendance_type", "cutoff_time", {
          type: Sequelize.INTEGER,
          allowNull: true,
    
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("attendance_type");
    if (tableDefinition && tableDefinition["cutoff_time"]) {
      await queryInterface.removeColumn("attendance_type", "cutoff_time");
    }
  },
};