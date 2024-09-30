"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("inventory");
        if (tableDefinition && tableDefinition["deleteAt"]) {
            await queryInterface.removeColumn("inventory", "deleteAt", {
                type: Sequelize.DATE,
                allowNull: true,
            });
        }
    },
    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("inventory");
        if (tableDefinition && tableDefinition["deleteAt"]) {
            await queryInterface.addColumn("inventory", "deleteAt", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
    },
};
