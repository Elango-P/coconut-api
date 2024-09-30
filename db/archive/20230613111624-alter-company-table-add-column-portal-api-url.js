'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("company");
    if (tableDefinition && !tableDefinition["portal_api_url"]) {
      await queryInterface.addColumn("company", "portal_api_url", {
          type: Sequelize.STRING,
          allowNull: true,
      });
    }

  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("company");
    if (tableDefinition && tableDefinition["portal_api_url"]) {
      await queryInterface.removeColumn("company", "portal_api_url");
    }
  },
};
