"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("accounts_bill");

    if (tableDefinition && tableDefinition["portal_id"]) {
      await queryInterface.removeColumn("accounts_bill", "portal_id");
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("accounts_bill");

    if (tableDefinition && !tableDefinition["portal_id"]) {
      await queryInterface.addColumn("accounts_bill", "portal_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },
};
