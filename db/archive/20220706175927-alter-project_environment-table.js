"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("project_environment");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("project_environment", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("project_environment", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("project_environment");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("project_environment", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("project_environment", "portal_id");
      }
    },
};