"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("sales");

    if (tableDefinition && !tableDefinition["sales_executive"]) {
      await queryInterface.addColumn("sales", "sales_executive", {
        type: Sequelize.INTEGER,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("sales");

    if (tableDefinition && tableDefinition["sales_executive"]) {
      await queryInterface.removeColumn("sales", "sales_executive");
    }
  },
};
