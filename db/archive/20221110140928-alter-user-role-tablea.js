"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user_role");

    if (tableDefinition && !tableDefinition["company_id"]) {
      await queryInterface.addColumn("user_role", "company_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("user_role");

    if (tableDefinition && tableDefinition["company_id"]) {
      await queryInterface.removeColumn("user_role", "company_id");
    }
  },
};
