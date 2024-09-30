"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        return queryInterface.describeTable("shift").then(tableDefinition => {
            if (tableDefinition && tableDefinition["sale_settlement_required"]) {
                return queryInterface.removeColumn("shift", "sale_settlement_required");
            } else {
                return Promise.resolve(true);
            }
        });
    },
};
