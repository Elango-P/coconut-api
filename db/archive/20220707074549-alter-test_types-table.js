"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("test_types");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("test_types", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("test_types", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("test_types");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("test_types", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("test_types", "portal_id");
      }
    },
};