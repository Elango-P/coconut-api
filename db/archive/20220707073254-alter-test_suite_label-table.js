"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("test_suite_label");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("test_suite_label", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("test_suite_label", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("test_suite_label");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("test_suite_label", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("test_suite_label", "portal_id");
      }
    },
};