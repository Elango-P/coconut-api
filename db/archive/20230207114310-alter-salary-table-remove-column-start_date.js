"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("salary");
    if (tableDefinition && tableDefinition["start_date"]) {
      await queryInterface.removeColumn("salary", "start_date");
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("salary");

    if (tableDefinition && !tableDefinition["start_date"]) {
      await queryInterface.addColumn("salary", "start_date",{
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  }
};