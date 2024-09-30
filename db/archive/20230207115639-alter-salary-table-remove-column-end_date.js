"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("salary");
    if (tableDefinition && tableDefinition["end_date"]) {
      await queryInterface.removeColumn("salary", "end_date");
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("salary");

    if (tableDefinition && !tableDefinition["end_date"]) {
      await queryInterface.addColumn("salary", "end_date",{
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
  }
};