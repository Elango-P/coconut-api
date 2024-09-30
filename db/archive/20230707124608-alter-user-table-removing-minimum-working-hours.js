"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user");

    if (tableDefinition && tableDefinition["minimum_working_hours"]) {
      await queryInterface.removeColumn("user", "minimum_working_hours");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user");

    if (tableDefinition && !tableDefinition["minimum_working_hours"]) {
      await queryInterface.addColumn("user", "minimum_working_hours", {
        type: Sequelize.NUMERIC,
        allowNull: true,
      });
    }
  },
};
