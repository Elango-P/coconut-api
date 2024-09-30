"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("account_product");

        if (tableDefinition && tableDefinition["regular_margin_percentage"]) {
            return queryInterface.renameColumn(
                "account_product",
                "regular_margin_percentage",
                "margin_percentage"
            );
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("account_product");

        if (tableDefinition && tableDefinition["margin_percentage"]) {
            return queryInterface.renameColumn(
                "account_product",
                "margin_percentage",
                "regular_margin_percentage"
            );
        }
    },
};
