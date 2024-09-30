"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.describeTable("store").then(tableDefinition => {
            if (tableDefinition && tableDefinition["ip_address"]) {
                return queryInterface.changeColumn(
                    "store",
                    "ip_address",
                    {
                        type: Sequelize.STRING,
                        allowNull: true,
                    }
                );
            } else {
                return Promise.resolve(true);
            }
        });
    },
};
