"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("inventory");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("inventory", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("inventory", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("inventory");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("inventory", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("inventory", "portal_id");
      }
    },
};