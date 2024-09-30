"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("vendor_product_image");

        if (tableDefinition && !tableDefinition["company_id"]) {
            await queryInterface.addColumn("vendor_product_image", "company_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["portal_id"]) {
          await queryInterface.addColumn("vendor_product_image", "portal_id", {
              type: Sequelize.INTEGER,
              allowNull: true,
          });
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("vendor_product_image");

        if (tableDefinition && tableDefinition["company_id"]) {
            await queryInterface.removeColumn("vendor_product_image", "company_id");
        }
        if (tableDefinition && tableDefinition["portal_id"]) {
          await queryInterface.removeColumn("vendor_product_image", "portal_id");
      }
    },
};