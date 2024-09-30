"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            const tableDefinition = await queryInterface.describeTable("user");

            if (tableDefinition && !tableDefinition["mobile_number1"]) {
                queryInterface.addColumn("user", "mobile_number1", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["mobile_number2"]) {
                queryInterface.addColumn("user", "mobile_number2", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["address1"]) {
                queryInterface.addColumn("user", "address1", {
                    type: Sequelize.TEXT,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["address2"]) {
                queryInterface.addColumn("user", "address2", {
                    type: Sequelize.TEXT,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["city"]) {
                queryInterface.addColumn("user", "city", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["state"]) {
                queryInterface.addColumn("user", "state", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["country"]) {
                queryInterface.addColumn("user", "country", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            }
            if (tableDefinition && !tableDefinition["pin_code"]) {
                queryInterface.addColumn("user", "pin_code", {
                    type: Sequelize.STRING,
                    allowNull: true,
                });
            }
        } catch (err) {
            console.log(err);
        }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("user");

        if (tableDefinition && tableDefinition["mobile_number1"]) {
            queryInterface.removeColumn("user", "mobile_number1");
        }
        if (tableDefinition && tableDefinition["mobile_number2"]) {
            queryInterface.removeColumn("user", "mobile_number2");
        }
        if (tableDefinition && tableDefinition["address1"]) {
            queryInterface.removeColumn("user", "address1");
        }
        if (tableDefinition && tableDefinition["address2"]) {
            queryInterface.removeColumn("user", "address2");
        }
        if (tableDefinition && tableDefinition["city"]) {
            queryInterface.removeColumn("user", "city");
        }
        if (tableDefinition && tableDefinition["state"]) {
            queryInterface.removeColumn("user", "state");
        }
        if (tableDefinition && tableDefinition["country"]) {
            queryInterface.removeColumn("user", "country");
        }
        if (tableDefinition && tableDefinition["pin_code"]) {
            queryInterface.removeColumn("user", "pin_code");
        }
    },
};
