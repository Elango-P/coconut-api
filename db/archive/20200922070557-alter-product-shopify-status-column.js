"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("product");
        if (tableDefinition && tableDefinition["shopify_status"]) {
            await queryInterface.changeColumn("product", "shopify_status", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }
    },
    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("product");
        if (tableDefinition && tableDefinition["shopify_status"]) {
            await queryInterface.changeColumn("product", "shopify_status", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
    },
};
