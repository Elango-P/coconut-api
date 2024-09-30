"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("project_label");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("project_label", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("project_label", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("project_label");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("project_label", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("project_label", "portal_id");
      }
    },
};