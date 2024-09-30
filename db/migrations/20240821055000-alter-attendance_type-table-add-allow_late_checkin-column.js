"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn("attendance_type", "allow_late_checkin", {
            type: Sequelize.BOOLEAN,
            allowNull: true,
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn("attendance_type", "allow_late_checkin");
    },
};
