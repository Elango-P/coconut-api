"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("visitor");

        if (tableDefinition && tableDefinition["company"]) {
            await queryInterface.renameColumn(
                "visitor",
                "company",
                "purpose"
            );
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("visitor");

        if (tableDefinition && tableDefinition["company"]) {
            await queryInterface.renameColumn(
                "visitor",
                "company",
                "purpose"
            );
        }
    },
};
