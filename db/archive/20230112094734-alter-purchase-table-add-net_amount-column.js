"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase");

    if (tableDefinition && !tableDefinition["net_amount"]) {
      await queryInterface.addColumn("purchase", "net_amount", {
        type: Sequelize.NUMERIC,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase");

    if (tableDefinition && tableDefinition["purchase"]) {
      await queryInterface.removeColumn("purchase", "net_amount");
    }
  },
};
