"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("apartment");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("apartment", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("apartment", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("apartment");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("apartment", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("apartment", "portal_id");
      }
    },
};