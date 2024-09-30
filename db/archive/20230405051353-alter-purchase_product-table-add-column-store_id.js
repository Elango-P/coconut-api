"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("purchase_product");

        if (tableDefinition && !tableDefinition["store_id"]) {
            await queryInterface.addColumn("purchase_product", "store_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }

        if (tableDefinition && !tableDefinition["vendor_id"]) {
            await queryInterface.addColumn("purchase_product", "vendor_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("purchase_product");

        if (tableDefinition && tableDefinition["store_id"]) {
            await queryInterface.removeColumn("purchase_product", "store_id");
        }

        if (tableDefinition && tableDefinition["vendor_id"]) {
            await queryInterface.removeColumn("purchase_product", "vendor_id", {
                type: Sequelize.DECIMAL,
                allowNull: true,
            });
        }
    },
};
