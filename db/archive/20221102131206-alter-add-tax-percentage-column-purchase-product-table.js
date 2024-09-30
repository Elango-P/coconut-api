"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_product");
    if (tableDefinition && !tableDefinition["tax_percentage"]) {
      await queryInterface.addColumn("purchase_product", "tax_percentage", {
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_product");

    if (tableDefinition && tableDefinition["tax_percentage"]) {
      await queryInterface.removeColumn("purchase_product", "tax_percentage");
    }
  }
};

