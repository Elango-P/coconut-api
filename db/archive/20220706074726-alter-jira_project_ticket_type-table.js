"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("jira_project_ticket_type");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("jira_project_ticket_type", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("jira_project_ticket_type", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("jira_project_ticket_type");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("jira_project_ticket_type", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("jira_project_ticket_type", "portal_id");
      }
    },
};