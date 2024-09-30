"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("product");

        if (tableDefinition && !tableDefinition["charge_taxes"]) {
            await queryInterface.addColumn("product", "charge_taxes", {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("product");

        if (tableDefinition && tableDefinition["charge_taxes"]) {
            await queryInterface.removeColumn("product", "charge_taxes");
        }
    },
};
