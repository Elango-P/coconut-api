"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("test_case");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("test_case", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("test_case", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("test_case");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("test_case", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("test_case", "portal_id");
      }
    },
};