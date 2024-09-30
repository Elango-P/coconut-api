"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "vendor_product"
        );

        if (tableDefinition && !tableDefinition["imported_at"]) {
            await queryInterface.addColumn("vendor_product", "imported_at", {
                type: Sequelize.DATE,
                allowNull: true,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "vendor_product"
        );

        if (tableDefinition && tableDefinition["imported_at"]) {
            await queryInterface.removeColumn("vendor_product", "imported_at");
        }
    },
};
