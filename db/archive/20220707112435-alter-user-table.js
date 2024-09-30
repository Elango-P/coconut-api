"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("user");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("user", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("user", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },
    
    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("user");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("user", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("user", "portal_id");
      }
    },
};