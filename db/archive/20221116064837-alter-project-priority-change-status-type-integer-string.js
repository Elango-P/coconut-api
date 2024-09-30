"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("project_priority");
        if (tableDefinition && tableDefinition["status"]) {
            await queryInterface.changeColumn("project_priority", "status", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }
    },
    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("project_priority");
        if (tableDefinition && tableDefinition["status"]) {
            await queryInterface.changeColumn("product_priority", "status", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
    },
};
