"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("role_permission");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("role_permission", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("role_permission", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("role_permission");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("role_permission", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("role_permission", "portal_id");
      }
    },
};