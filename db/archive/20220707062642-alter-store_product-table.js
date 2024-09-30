"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("store_product");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("store_product", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("store_product", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("store_product");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("store_product", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("store_product", "portal_id");
      }
    },
};