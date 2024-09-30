"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("inventory");

        if (tableDefinition && !tableDefinition["date"]) {
            await queryInterface.addColumn("inventory", "date", {
                type: Sequelize.DATE,
                allowNull: true,
            });
        }
        if (tableDefinition && !tableDefinition["vendor_id"]) {
            await queryInterface.addColumn("inventory", "vendor_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }

        if (tableDefinition && !tableDefinition["product_id"]) {
            await queryInterface.addColumn("inventory", "product_id", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }

        if (tableDefinition && !tableDefinition["price"]) {
            await queryInterface.addColumn("inventory", "price", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }


        if (tableDefinition && !tableDefinition["quantity"]) {
            await queryInterface.addColumn("inventory", "quantity", {
                type: Sequelize.INTEGER,
                allowNull: true,
            });
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("inventory");

        if (tableDefinition && tableDefinition["date"]) {
            await queryInterface.removeColumn("inventory", "date");
        }
        if (tableDefinition && tableDefinition["product_id"]) {
            await queryInterface.removeColumn("inventory", "product_id");
        }
        if (tableDefinition && tableDefinition["price"]) {
            await queryInterface.removeColumn("inventory", "price");
        }
        if (tableDefinition && tableDefinition["quantity"]) {
            await queryInterface.removeColumn("inventory", "quantity");
        }
    },
};