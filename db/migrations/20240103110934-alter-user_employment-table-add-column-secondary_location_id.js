"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "user_employment"
        );

        if (tableDefinition && !tableDefinition["secondary_location_id"]) {
            await queryInterface.addColumn("user_employment", "secondary_location_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }

        if (tableDefinition && !tableDefinition["secondary_shift_id"]) {
            await queryInterface.addColumn("user_employment", "secondary_shift_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }

    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "user_employment"
        );

        if (tableDefinition && tableDefinition["secondary_location_id"]) {
            await queryInterface.removeColumn(
                "user_employment",
                "secondary_location_id"
            );
        }

        if (tableDefinition && tableDefinition["secondary_shift_id"]) {
            await queryInterface.removeColumn(
                "user_employment",
                "secondary_shift_id"
            );
        }



    },
};
