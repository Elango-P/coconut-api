"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "store_product"
        );

        if (tableDefinition && tableDefinition["store_product_id"]) {
            await queryInterface.changeColumn(
                "store_product",
                "store_product_id",
                {
                    type: Sequelize.BIGINT,
                }
            );
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "store_product"
        );

        if (tableDefinition && tableDefinition["store_product_id"]) {
            await queryInterface.changeColumn(
                "store_product",
                "store_product_id",
                {
                    type: Sequelize.INTEGER,
                }
            );
        }
    },
};
