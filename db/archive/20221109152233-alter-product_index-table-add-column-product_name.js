"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("product_index");
        if (tableDefinition && tableDefinition["product_name"]) {
            await queryInterface.changeColumn("product_index", "product_name", {
                type: Sequelize.TEXT,
                allowNull: true,
            });
        }
    },
    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("product_index");
        if (tableDefinition && tableDefinition["product_name"]) {
            await queryInterface.changeColumn("product_index", "product_name", {
                type: Sequelize.TEXT,
                allowNull: false,
            });
        }
    },
};
