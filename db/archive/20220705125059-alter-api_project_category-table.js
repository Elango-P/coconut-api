"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("api_project_category");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("api_project_category", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("api_project_category", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("api_project_category");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("api_project_category", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("api_project_category", "portal_id");
      }
    },
};
