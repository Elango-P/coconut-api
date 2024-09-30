"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("project_release_note");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("project_release_note", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("project_release_note", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("project_release_note");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("project_release_note", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("project_release_note", "portal_id");
      }
    },
};