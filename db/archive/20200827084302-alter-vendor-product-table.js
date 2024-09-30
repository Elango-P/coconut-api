"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface
            .describeTable("vendor_product")
            .then(tableDefinition => {
                if (tableDefinition && !tableDefinition["brand_id"]) {
                    return queryInterface.addColumn(
                        "vendor_product",
                        "brand_id",
                        {
                            type: Sequelize.INTEGER,
                            allowNull: true,
                        }
                    );
                } else {
                    return Promise.resolve(true);
                }
            })
            .then(tableDefinition => {
                if (tableDefinition && !tableDefinition["category_id"]) {
                    return queryInterface.addColumn(
                        "vendor_product",
                        "category_id",
                        {
                            type: Sequelize.INTEGER,
                            allowNull: true,
                        }
                    );
                } else {
                    return Promise.resolve(true);
                }
            })
            .then(tableDefinition => {
                if (tableDefinition && tableDefinition["brand_name"]) {
                    return queryInterface.removeColumn(
                        "vendor_product",
                        "brand_name"
                    );
                } else {
                    return Promise.resolve(true);
                }
            })
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
