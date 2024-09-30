"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.describeTable("sales").then(tableDefinition => {
            if (tableDefinition && tableDefinition["cash_in_store"]) {
                return queryInterface.changeColumn(
                    "sales",
                    "cash_in_store",
                    {
                        type: Sequelize.DECIMAL,
                        allowNull: true,
                    }
                );
            } else {
                return Promise.resolve(true);
            }
        });
    },
};
