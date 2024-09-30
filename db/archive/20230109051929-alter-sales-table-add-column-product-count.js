"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("sales");

    if (tableDefinition && !tableDefinition["product_count"]) {
      await queryInterface.addColumn("sales", "product_count", {
        type: Sequelize.INTEGER,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("sales");

    if (tableDefinition && tableDefinition["sales"]) {
      await queryInterface.removeColumn("sales", "product_count");
    }
  },
};
