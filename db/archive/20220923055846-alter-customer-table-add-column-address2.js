"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("customer");

    if (tableDefinition && !tableDefinition["address2"]) {
      await queryInterface.addColumn("customer", "address2", {
        type: Sequelize.STRING,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("customer");

    if (tableDefinition && tableDefinition["address2"]) {
      await queryInterface.removeColumn("customer", "address2");
    }
  },
};
