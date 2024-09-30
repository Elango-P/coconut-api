"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_product");
    if (tableDefinition && !tableDefinition["discount_amount"]) {
      await queryInterface.addColumn("purchase_product", "discount_amount", {
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_product");

    if (tableDefinition && tableDefinition["discount_amount"]) {
      await queryInterface.removeColumn("purchase_product", "discount_amount");
    }
  }
};

