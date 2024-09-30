"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.describeTable("product").then(tableDefinition => {
            if (tableDefinition && tableDefinition["price"]) {
                return queryInterface.changeColumn("product", "price", {
                    type: Sequelize.DECIMAL,
                    allowNull: true,
                });
            } else {
                return Promise.resolve(true);
            }
        });
    },
};
