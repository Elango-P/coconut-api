"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.describeTable("product").then(tableDefinition => {
            if (
                tableDefinition &&
                !tableDefinition["allow_sell_out_of_stock"]
            ) {
                return queryInterface.addColumn(
                    "product",
                    "allow_sell_out_of_stock",
                    {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    }
                );
            } else {
                return Promise.resolve(true);
            }
        });
    },
};
