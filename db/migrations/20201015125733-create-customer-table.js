"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Console log
            console.log("Creating customer table");

            // Defining whether the customer table already exist or not.
            const customerTableExists = await queryInterface.tableExists("customer");

            // Condition for creating the customer table only if the table doesn't exist already.
            if (!customerTableExists) {
                await queryInterface.createTable("customer", {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    first_name: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    last_name: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    email: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    mobile_number1: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    order_counts: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    state: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    country: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    status: {
                        type: Sequelize.STRING,
                    },
                    total_spent: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    last_order_id: {
                        type: Sequelize.BIGINT,
                        allowNull: true,
                    },
                    note: {
                        type: Sequelize.TEXT,
                        allowNull: true,
                    },
                    verified_email: {
                        type: Sequelize.BOOLEAN,
                        allowNull: true,
                    },
                    tags: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    currency: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    address1: {
                        type: Sequelize.JSON,
                        allowNull: true,
                    },
                    company_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                    createdAt: {
                        allowNull: false,
                        type: Sequelize.DATE,
                    },
                    updatedAt: {
                        allowNull: false,
                        type: Sequelize.DATE,
                    },
                    deletedAt: {
                        allowNull: true,
                        type: Sequelize.DATE,
                    },
                    city: {
                        allowNull: true,
                        type: Sequelize.STRING
                    },
                    mobile_number2: {

                        allowNull: true,
                        type: Sequelize.STRING
                    },
                    address2: {
                        allowNull: true,
                        type: Sequelize.STRING
                    },
                    pincode: {
                        allowNull: true,
                        type: Sequelize.STRING
                    },
                    store_id: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    store_customer_id: {
                        type: Sequelize.BIGINT,
                        allowNull: true,
                    },
                    password: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                });
            };
        } catch (err) {
            console.log(err);
        };
    },

    down: async (queryInterface, Sequelize) => {
        try {
            // Defining whether the customer table already exist or not.
            const customerTableExists = await queryInterface.tableExists("customer");

            // Condition for dropping the customer table only if the table exist already.
            if (customerTableExists) {
                await queryInterface.dropTable("customer");
            };
        } catch (err) {
            console.log(err);
        };
    },
};
