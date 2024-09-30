"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("product");

        // if (tableDefinition && tableDefinition["charge_taxes"]) {
        //     return queryInterface.renameColumn(
        //         "product",
        //         "charge_taxes",
        //         "taxable"
        //     );
        // }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("product");

        if (tableDefinition && tableDefinition["taxable"]) {
            return queryInterface.renameColumn(
                "product",
                "taxable",
                "charge_taxes"
            );
        }
    },
};
