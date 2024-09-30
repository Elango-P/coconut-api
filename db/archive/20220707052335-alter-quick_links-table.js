"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("quick_links");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("quick_links", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("quick_links", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("quick_links");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("quick_links", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("quick_links", "portal_id");
      }
    },
};