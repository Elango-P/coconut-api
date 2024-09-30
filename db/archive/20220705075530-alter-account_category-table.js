"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("account_category");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("account_category", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("account_category", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("account_category");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("account_category", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("account_category", "portal_id");
      }
    },
};
