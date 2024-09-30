"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_order");

    if (tableDefinition && !tableDefinition["description"]) {
      await queryInterface.addColumn("purchase_order", "description", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase_order");

    if (tableDefinition && tableDefinition["description"]) {
      await queryInterface.removeColumn("purchase_order", "description");
    }
  },
};
