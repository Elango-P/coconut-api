"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("dashboard_index");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("dashboard_index", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("dashboard_index", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("dashboard_index");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("dashboard_index", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("dashboard_index", "portal_id");
      }
    },
};