"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("store", "allow_check_in", {
            type: Sequelize.INTEGER,
            allowNull: true,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn("store", "allow_check_in");
    },
};
