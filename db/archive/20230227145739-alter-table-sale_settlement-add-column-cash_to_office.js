"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("sale_settlement");

    if (tableDefinition && !tableDefinition["cash_to_office"]) {
      await queryInterface.addColumn("sale_settlement", "cash_to_office", {
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("sale_settlement");

    if (tableDefinition && tableDefinition["cash_to_office"]) {
      await queryInterface.removeColumn("sale_settlement", "cash_to_office");
    }
  },
};
