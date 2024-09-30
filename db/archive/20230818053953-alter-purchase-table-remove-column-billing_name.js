"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase");

    if (tableDefinition && tableDefinition["billing_name"]) {
      await queryInterface.removeColumn("purchase", "billing_name");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase");

    if (tableDefinition && !tableDefinition["billing_name"]) {
      await queryInterface.addColumn("purchase", "billing_name", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
