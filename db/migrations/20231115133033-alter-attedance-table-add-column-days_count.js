'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("attendance");

    if (tableDefinition && !tableDefinition["days_count"]) {
      await queryInterface.addColumn("attendance", "days_count", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("attendance");

    if (tableDefinition && tableDefinition["days_count"]) {
      await queryInterface.removeColumn("attendance", "days_count");
    }
  },
};
