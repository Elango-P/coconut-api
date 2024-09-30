"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("collection_product_tag");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("collection_product_tag", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("collection_product_tag", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("collection_product_tag");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("collection_product_tag", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("collection_product_tag", "portal_id");
      }
    },
};