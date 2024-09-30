"use strict";
module.exports = {
    up: (queryInterface, Sequelize) => {
        try {
            return queryInterface.changeColumn(
                "purchase",
                "amount",
                {
                    type: Sequelize.NUMERIC,
                    allowNull: true,
                }
            );
        } catch (err) {
            console.log(err);
        }
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.changeColumn(
            "purchase",
            "amount",
            {
                type: Sequelize.NUMERIC,
                allowNull: true,
            }
        );
    },
};