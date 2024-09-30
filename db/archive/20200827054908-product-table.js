"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.describeTable("product").then(tableDefinition => {
            if (tableDefinition && !tableDefinition["barcode"]) {
                return queryInterface.addColumn("product", "barcode", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            } else {
                return Promise.resolve(true);
            }
        });
    },
};
