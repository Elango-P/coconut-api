"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("store");

        if (tableDefinition && !tableDefinition["shopify_shop_name"]) {
            await queryInterface.addColumn("store", "shopify_shop_name", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }

        if (tableDefinition && !tableDefinition["shopify_admin_api_version"]) {
            await queryInterface.addColumn(
                "store",
                "shopify_admin_api_version",
                {
                    type: Sequelize.STRING,
                    allowNull: true,
                }
            );
        }

        if (tableDefinition && !tableDefinition["shopify_api_key"]) {
            await queryInterface.addColumn("store", "shopify_api_key", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }

        if (tableDefinition && !tableDefinition["shopify_password"]) {
            await queryInterface.addColumn("store", "shopify_password", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("store");

        if (tableDefinition && tableDefinition["shopify_shop_name"]) {
            await queryInterface.removeColumn("store", "shopify_shop_name");
        }

        if (tableDefinition && tableDefinition["shopify_admin_api_version"]) {
            await queryInterface.removeColumn(
                "store",
                "shopify_admin_api_version"
            );
        }

        if (tableDefinition && tableDefinition["shopify_api_key"]) {
            await queryInterface.removeColumn("store", "shopify_api_key");
        }

        if (tableDefinition && tableDefinition["shopify_password"]) {
            await queryInterface.removeColumn("store", "shopify_password");
        }
    },
};
