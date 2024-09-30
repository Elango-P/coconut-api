"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");

    if (tableDefinition && !tableDefinition["last_purchased_date "]) {
      await queryInterface.addColumn("product_index", "last_purchased_date ", {
        type: Sequelize.DATE,
        allowNull: true,
      });
    }
    if (tableDefinition && !tableDefinition["last_purchased_cost"]) {
      await queryInterface.addColumn("product_index", "last_purchased_cost", {
        type: Sequelize.DECIMAL,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");

    if (tableDefinition && tableDefinition["last_purchased_date "]) {
      await queryInterface.removeColumn("product_index", "last_purchased_date ");
    }
    if (tableDefinition && !tableDefinition["last_purchased_cost"]) {
      await queryInterface.removeColumn("product_index", "last_purchased_cost", {
       
      });
    }
  },
};