"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("order");

        if (tableDefinition && !tableDefinition["store_id"]) {
            await queryInterface.addColumn("order", "store_id", {
                type: Sequelize.BIGINT,
            });
        }

        if (tableDefinition && tableDefinition["order_number"]) {
            await queryInterface.removeColumn("order", "order_number");
        }

        if (tableDefinition && tableDefinition["order_number"]) {
            await queryInterface.addColumn("order", "order_number", {
                type: Sequelize.BIGINT,
            });
        }

        if (tableDefinition && tableDefinition["customer_address"]) {
            await queryInterface.changeColumn("order", "customer_address", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }

        if (tableDefinition && tableDefinition["customer_phone"]) {
            await queryInterface.changeColumn("order", "customer_phone", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("order");

        if (tableDefinition && tableDefinition["store_id"]) {
            await queryInterface.removeColumn("order", "store_id");
        }

        if (tableDefinition && tableDefinition["order_number"]) {
            await queryInterface.changeColumn("order", "order_number", {
                type: Sequelize.DECIMAL,
            });
        }

        if (tableDefinition && tableDefinition["customer_address"]) {
            await queryInterface.changeColumn("order", "customer_address", {
                type: Sequelize.STRING,
                allowNull: false,
            });
        }

        if (tableDefinition && tableDefinition["customer_phone"]) {
            await queryInterface.changeColumn("order", "customer_phone", {
                type: Sequelize.STRING,
                allowNull: false,
            });
        }
    },
};
