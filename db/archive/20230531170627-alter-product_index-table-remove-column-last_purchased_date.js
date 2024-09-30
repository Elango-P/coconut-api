"use strict";
last_purchased_date
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");

    if (tableDefinition && tableDefinition["last_purchased_date"]) {
      await queryInterface.removeColumn("product_index", "");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("product_index");

    if (tableDefinition && !tableDefinition["last_purchased_date"]) {
      await queryInterface.addColumn("product_index", "last_purchased_date", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
