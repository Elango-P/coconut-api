"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.describeTable("employee").then(tableDefinition => {
            if (tableDefinition && tableDefinition["status"]) {
                return queryInterface.changeColumn("employee", "status", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            } else {
                return Promise.resolve(true);
            }
        });
    },
};
