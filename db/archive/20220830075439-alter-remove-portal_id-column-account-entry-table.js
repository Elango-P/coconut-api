"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("account_entry");

    if (tableDefinition && tableDefinition["portal_id"]) {
      console.log("Altering account_entry table - removing portal_id column");
      await queryInterface.removeColumn("account_entry", "portal_id");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("account_entry");

    if (tableDefinition && !tableDefinition["portal_id"]) {
      await queryInterface.addColumn("account_entry", "portal_id", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },
};