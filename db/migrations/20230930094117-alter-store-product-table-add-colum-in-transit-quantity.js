'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("store_product");
    if (tableDefinition && !tableDefinition["in_transit_quantity"]) {
      await queryInterface.addColumn("store_product", "in_transit_quantity", {
          type: Sequelize.INTEGER,
          allowNull: true,
    
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order");
    if (tableDefinition && tableDefinition["in_transit_quantity"]) {
      await queryInterface.removeColumn("store_product", "in_transit_quantity");
    }
  },
};