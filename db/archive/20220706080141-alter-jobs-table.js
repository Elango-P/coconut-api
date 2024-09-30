"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("jobs");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("jobs", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("jobs", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("jobs");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("jobs", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("jobs", "portal_id");
      }
    },
};