"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase");

    if (tableDefinition && !tableDefinition["discount_amount"]) {
      await queryInterface.addColumn("purchase", "discount_amount", {
        type: Sequelize.NUMERIC,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase");

    if (tableDefinition && tableDefinition["purchase"]) {
      await queryInterface.removeColumn("purchase", "discount_amount");
    }
  },
};
