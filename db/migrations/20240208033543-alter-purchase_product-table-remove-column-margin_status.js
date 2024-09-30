"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "purchase_product"
        );

        if (tableDefinition && tableDefinition["pack_size"]) {
            await queryInterface.removeColumn("purchase_product", "pack_size");
        }

        if (tableDefinition && tableDefinition["margin_status"]) {
            await queryInterface.removeColumn("purchase_product", "margin_status");
        }

        if (tableDefinition && tableDefinition["store_product_id"]) {
          await queryInterface.removeColumn("purchase_product", "store_product_id");
      }
    },
};
