"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "vendor_product"
        );

        if (tableDefinition && !tableDefinition["vendor_id"]) {
            await queryInterface.addColumn("vendor_product", "vendor_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "vendor_product"
        );

        if (tableDefinition && tableDefinition["vendor_id"]) {
            await queryInterface.removeColumn("vendor_product", "vendor_id");
        }
    },
};
