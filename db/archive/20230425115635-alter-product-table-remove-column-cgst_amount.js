"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");
    if (tableDefinition && tableDefinition["cgst_amount"]) {
      await queryInterface.removeColumn("product", "cgst_amount");
    }
    if (tableDefinition && tableDefinition["sgst_amount"]) {
      await queryInterface.removeColumn("product", "sgst_amount");
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product");

    if (tableDefinition && !tableDefinition["cgst_amount"]) {
      await queryInterface.addColumn("product", "cgst_amount",{
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["sgst_amount"]) {
      await queryInterface.addColumn("product", "sgst_amount",{
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
  }
};