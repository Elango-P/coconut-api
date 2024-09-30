"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.describeTable("product").then(tableDefinition => {
            if (tableDefinition && tableDefinition["brand_name"]) {
                return queryInterface.removeColumn("product", "brand_name");
            } else {
                return Promise.resolve(true);
            }
        });
        await queryInterface.describeTable("product").then(tableDefinition => {
            if (tableDefinition && tableDefinition["type_name"]) {
                return queryInterface.removeColumn("product", "type_name");
            } else {
                return Promise.resolve(true);
            }
        });
        await queryInterface
            .describeTable("vendor_product")
            .then(tableDefinition => {
                if (tableDefinition && tableDefinition["brand_name"]) {
                    return queryInterface.removeColumn(
                        "vendor_product",
                        "brand_name"
                    );
                } else {
                    return Promise.resolve(true);
                }
            });
        await queryInterface
            .describeTable("vendor_product")
            .then(tableDefinition => {
                if (tableDefinition && tableDefinition["type_name"]) {
                    return queryInterface.removeColumn(
                        "vendor_product",
                        "type_name"
                    );
                } else {
                    return Promise.resolve(true);
                }
            });
    },
};
