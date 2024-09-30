"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order");

    if (tableDefinition && tableDefinition["customer_address"]) {
      await queryInterface.removeColumn("order", "customer_address");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order");

    if (tableDefinition && !tableDefinition["customer_address"]) {
      await queryInterface.addColumn("order", "customer_address", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
