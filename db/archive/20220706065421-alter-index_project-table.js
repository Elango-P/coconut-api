"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("index_project");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("index_project", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("index_project", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("index_project");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("index_project", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("index_project", "portal_id");
      }
    },
};