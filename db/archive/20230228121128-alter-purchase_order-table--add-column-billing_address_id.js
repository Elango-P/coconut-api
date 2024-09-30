"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "purchase_order"
        );

        if (tableDefinition && !tableDefinition["billing_address_id"]) {
            await queryInterface.addColumn("purchase_order", "billing_address_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }

        if (tableDefinition && !tableDefinition["delivery_address_id"]) {
            await queryInterface.addColumn("purchase_order", "delivery_address_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }

    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable(
            "purchase_order"
        );

        if (tableDefinition && tableDefinition["billing_address_id"]) {
            await queryInterface.removeColumn(
                "purchase_order",
                "billing_address_id"
            );
        }

        if (tableDefinition && tableDefinition["delivery_address_id"]) {
            await queryInterface.removeColumn(
                "purchase_order",
                "delivery_address_id"
            );
        }


    },
};
