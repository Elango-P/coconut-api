"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order");

    if (tableDefinition && tableDefinition["portal_id"]) {
      await queryInterface.removeColumn("order", "portal_id");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("order");

    if (tableDefinition && !tableDefinition["portal_id"]) {
      await queryInterface.addColumn("order", "portal_id", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
