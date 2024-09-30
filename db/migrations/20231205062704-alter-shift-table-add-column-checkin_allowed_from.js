'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("shift");
    if (tableDefinition && !tableDefinition["checkin_allowed_from"]) {
      await queryInterface.addColumn("shift", "checkin_allowed_from", {
          type: Sequelize.TIME,
          allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["checkin_allowed_till"]) {
      await queryInterface.addColumn("shift", "checkin_allowed_till", {
          type: Sequelize.TIME,
          allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("shift");
    if (tableDefinition && tableDefinition["checkin_allowed_from"]) {
      await queryInterface.removeColumn("shift", "checkin_allowed_from");
    }
    if (tableDefinition && tableDefinition["checkin_allowed_till"]) {
      await queryInterface.removeColumn("shift", "checkin_allowed_till");
    }
  },
};