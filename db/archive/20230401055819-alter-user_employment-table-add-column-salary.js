"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("user_employment");

        if (tableDefinition && !tableDefinition["salary"]) {
            await queryInterface.addColumn("user_employment", "salary", {
                type: Sequelize.NUMERIC,
                allowNull: true,
            });
        }
     
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("user_employment");

        if (tableDefinition && tableDefinition["salary"]) {
            await queryInterface.removeColumn("user_employment", "salary");
        }
      
    },
};