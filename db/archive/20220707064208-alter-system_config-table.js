"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("system_config");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("system_config", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("system_config", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("system_config");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("system_config", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("system_config", "portal_id");
      }
    },
};
