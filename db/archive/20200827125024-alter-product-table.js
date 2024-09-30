"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.describeTable("product").then(tableDefinition => {
            // if (tableDefinition && tableDefinition["allow_sell_out_of_stock"]) {
            //     return queryInterface.renameColumn(
            //         "product",
            //         "allow_sell_out_of_stock",
            //         "sell_out_of_stock"
            //     );
            // } else {
            //     return Promise.resolve(true);
            // }
        });
    },
};
