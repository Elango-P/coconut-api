"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("jira_auth");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("jira_auth", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("jira_auth", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("jira_auth");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("jira_auth", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("jira_auth", "portal_id");
      }
    },
};