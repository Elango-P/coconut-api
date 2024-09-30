"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order");

    if (tableDefinition && tableDefinition["customer_phone"]) {
      await queryInterface.removeColumn("order", "customer_phone");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order");

    if (tableDefinition && !tableDefinition["customer_phone"]) {
      await queryInterface.addColumn("order", "customer_phone", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
