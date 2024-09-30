"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.describeTable("product").then(tableDefinition => {
            if (tableDefinition && !tableDefinition["virtual_quantity"]) {
                return queryInterface.addColumn("product", "virtual_quantity", {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                });
            } else {
                return Promise.resolve(true);
            }
        });
    },
};
