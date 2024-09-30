"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("customer");

    if (tableDefinition && !tableDefinition["city"]) {
      await queryInterface.addColumn("customer", "city", {
        type: Sequelize.STRING,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("customer");

    if (tableDefinition && tableDefinition["city"]) {
      await queryInterface.removeColumn("customer", "city");
    }
  },
};
