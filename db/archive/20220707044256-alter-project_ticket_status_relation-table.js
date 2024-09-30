"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("project_ticket_status_relation");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("project_ticket_status_relation", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("project_ticket_status_relation", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("project_ticket_status_relation");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("project_ticket_status_relation", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("project_ticket_status_relation", "portal_id");
      }
    },
};
