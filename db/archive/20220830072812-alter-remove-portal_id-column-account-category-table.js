"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("account_category");

    if (tableDefinition && tableDefinition["portal_id"]) {
      await queryInterface.removeColumn("account_category", "portal_id");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("account_category");

    if (tableDefinition && !tableDefinition["portal_id"]) {
      await queryInterface.addColumn("account_category", "portal_id", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};
