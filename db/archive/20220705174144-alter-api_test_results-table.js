"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("api_test_results");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("api_test_results", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("api_test_results", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("api_test_results");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("api_test_results", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("api_test_results", "portal_id");
      }
    },
};