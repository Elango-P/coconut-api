"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.describeTable("attendance_type").then(tableDefinition => {
            if (tableDefinition && tableDefinition["type"]) {
                return queryInterface.removeColumn("attendance_type", "type");
            } else {
                return Promise.resolve(true);
            }
        });
    },
};
