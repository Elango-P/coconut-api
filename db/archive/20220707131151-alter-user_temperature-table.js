"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("user_temperature");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("user_temperature", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("user_temperature", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("user_temperature");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("user_temperature", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("user_temperature", "portal_id");
      }
    },
};