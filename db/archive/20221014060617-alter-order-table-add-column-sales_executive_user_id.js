"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");
    if (tableDefinition && !tableDefinition["sales_executive_user_id"]) {
      await queryInterface.addColumn("order", "sales_executive_user_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");

    if (tableDefinition && tableDefinition["sales_executive_user_id"]) {
      await queryInterface.removeColumn("order", "sales_executive_user_id");
    }
  }
};
