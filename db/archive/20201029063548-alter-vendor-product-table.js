"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "vendor_product"
        );

        if (tableDefinition && !tableDefinition["import_status"]) {
            await queryInterface.addColumn("vendor_product", "import_status", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "vendor_product"
        );

        if (tableDefinition && tableDefinition["import_status"]) {
            await queryInterface.removeColumn(
                "vendor_product",
                "import_status"
            );
        }
    },
};
