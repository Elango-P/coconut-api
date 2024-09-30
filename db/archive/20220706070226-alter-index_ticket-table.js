"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("index_ticket");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("index_ticket", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("index_ticket", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("index_ticket");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("index_ticket", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("index_ticket", "portal_id");
      }
    },
};