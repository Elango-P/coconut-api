"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.describeTable("sale_settlement").then(tableDefinition => {
            if (tableDefinition && tableDefinition["date"]) {
                return queryInterface.changeColumn(
                    "sale_settlement",
                    "date",
                    {
                        type: Sequelize.DATE,
                        allowNull: true,
                    }
                );
            } else {
                return Promise.resolve(true);
            }
        });
    },
};
