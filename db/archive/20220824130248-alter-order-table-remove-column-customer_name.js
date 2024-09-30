"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order");

    if (tableDefinition && tableDefinition["customer_name"]) {
      await queryInterface.removeColumn("order", "customer_name");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order");

    if (tableDefinition && !tableDefinition["customer_name"]) {
      await queryInterface.addColumn("order", "customer_name", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
