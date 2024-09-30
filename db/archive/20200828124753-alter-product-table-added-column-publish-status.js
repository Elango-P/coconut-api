"use strict";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.describeTable("product").then(tableDefinition => {
            if (tableDefinition && !tableDefinition["publish_status"]) {
                return queryInterface.addColumn("product", "publish_status", {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                    defaultValue: 0,
                });
            } else {
                return Promise.resolve(true);
            }
        });
    },
};
