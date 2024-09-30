"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("wiki_pages");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("wiki_pages", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("wiki_pages", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("wiki_pages");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("wiki_pages", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("wiki_pages", "portal_id");
      }
    },
};
