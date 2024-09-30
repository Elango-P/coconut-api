'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_product");
    if (tableDefinition && !tableDefinition["margin_status"]) {
      await queryInterface.addColumn("purchase_product", "margin_status", {
          type: Sequelize.INTEGER,
          allowNull: true,
      });
    }
   

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_product");
    if (tableDefinition && tableDefinition["margin_status"]) {
      await queryInterface.removeColumn("purchase_product", "margin_status");
    }
  },
};
