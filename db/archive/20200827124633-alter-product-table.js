"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.describeTable("product").then(tableDefinition => {
            if (tableDefinition && tableDefinition["image"]) {
                return queryInterface.removeColumn("product", "image");
            } else {
                return Promise.resolve(true);
            }
        });
    },
};
