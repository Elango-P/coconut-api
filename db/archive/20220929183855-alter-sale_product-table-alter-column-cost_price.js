"use strict";
module.exports = {
    up: (queryInterface, Sequelize) => {
        try {
            return queryInterface.changeColumn(
                "sale_product",
                "cost_price",
                {
                    type: Sequelize.DECIMAL,
                    allowNull: true,
                }
            );
        } catch (err) {
            console.log(err);
        }
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn(
            "sale_product",
            "cost_price",
            {
                type: Sequelize.DECIMAL,
                allowNull: true,
            }
        );
    },
};