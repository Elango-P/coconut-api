"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.describeTable("product").then(tableDefinition => {
            if (tableDefinition && tableDefinition["sale_price"]) {
                return queryInterface.changeColumn("product", "sale_price", {
                    type: Sequelize.DECIMAL,
                    allowNull: true,
                });
            } else {
                return Promise.resolve(true);
            }
        });
    },
};
