"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Change the data type of the "date" column from DATE to DATEONLY
        await queryInterface.changeColumn("fine", "date", {
            type: Sequelize.DATEONLY,
            allowNull: false,
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Revert the data type change if needed
        await queryInterface.changeColumn("fine", "date", {
            type: Sequelize.DATE,
            allowNull: false,
        });
    },
};
