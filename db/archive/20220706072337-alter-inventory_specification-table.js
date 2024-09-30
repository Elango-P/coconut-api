"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("inventory_specification");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("inventory_specification", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("inventory_specification", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("inventory_specification");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("inventory_specification", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("inventory_specification", "portal_id");
      }
    },
};