'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("attendance_type");
    if (tableDefinition && !tableDefinition["maximum_leave_allowed"]) {
      await queryInterface.addColumn("attendance_type", "maximum_leave_allowed", {
          type: Sequelize.INTEGER,
          allowNull: true,
    
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("attendance_type");
    if (tableDefinition && tableDefinition["maximum_leave_allowed"]) {
      await queryInterface.removeColumn("attendance_type", "maximum_leave_allowed");
    }
  },
};