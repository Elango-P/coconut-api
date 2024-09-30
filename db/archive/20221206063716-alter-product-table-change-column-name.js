"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("product");
        if (tableDefinition && tableDefinition["name"]) {
            await queryInterface.changeColumn("product", "name", {
                type: Sequelize.TEXT,
                allowNull: true,
            });
        }
    },
    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("product");
        if (tableDefinition && tableDefinition["name"]) {
            await queryInterface.changeColumn("product", "name", {
                type: Sequelize.TEXT,
                allowNull: false,
            });
        }
    },
};