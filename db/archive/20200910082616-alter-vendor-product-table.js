"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "vendor_product"
        );

        if (tableDefinition && tableDefinition["export_status"]) {
            await queryInterface.removeColumn(
                "vendor_product",
                "export_status"
            );
        }

        if (tableDefinition && tableDefinition["export_result"]) {
            await queryInterface.removeColumn(
                "vendor_product",
                "export_result"
            );
        }

        if (tableDefinition && tableDefinition["exported_at"]) {
            await queryInterface.removeColumn("vendor_product", "exported_at");
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "vendor_product"
        );

        if (tableDefinition && !tableDefinition["export_status"]) {
            await queryInterface.addColumn("vendor_product", "export_status", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }

        if (tableDefinition && !tableDefinition["export_result"]) {
            await queryInterface.addColumn("vendor_product", "export_result", {
                type: Sequelize.TEXT,
                allowNull: true,
            });
        }

        if (tableDefinition && !tableDefinition["exported_at"]) {
            await queryInterface.addColumn("vendor_product", "exported_at", {
                type: Sequelize.DATE,
                allowNull: true,
            });
        }
    },
};
