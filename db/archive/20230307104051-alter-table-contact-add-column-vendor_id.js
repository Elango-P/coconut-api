"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "contact"
        );

        if (tableDefinition && !tableDefinition["object_id"]) {
            await queryInterface.addColumn("contact", "object_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }

        if (tableDefinition && !tableDefinition["object_name"]) {
            await queryInterface.addColumn("contact", "object_name", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }

    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "contact"
        );

        if (tableDefinition && tableDefinition["object_id"]) {
            await queryInterface.removeColumn(
                "contact",
                "object_id"
            );
        }

        if (tableDefinition && tableDefinition["object_name"]) {
            await queryInterface.removeColumn(
                "contact",
                "object_name"
            );
        }
    },
};
