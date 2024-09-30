"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Console log
            console.log("Creating account table");

            // Defining whether the account table already exist or not.
            const accountTableExists = await queryInterface.tableExists("account");

            // Condition for creating the account table only if the table doesn't exist already.
            if (!accountTableExists) {
                await queryInterface.createTable("account", {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    name: {
                        type: Sequelize.STRING,
                    },
                    url: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    status:{
                        type: Sequelize.STRING,
                    },
                    gst_number: {
                        type: Sequelize.STRING,
                    },
                    email:{
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    mobile:{
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    work_phone:{
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    address1: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    address2: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    city:{
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    country: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    state: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    payment_terms: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    cash_discount: {
                        type: Sequelize.DECIMAL,
                        allowNull: true,
                    },
                  
                    return_terms:{
                        type: Sequelize.STRING,
                        allowNull: true,
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
                    company_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false
                    },
                    type: {
                        type: Sequelize.INTEGER,
                        allowNull: true
                    },
                    payment_account : {
                        type: Sequelize.INTEGER,  
                        allowNull: true
                    },
                    notes:{
                        type:Sequelize.TEXT,
                        allowNull:true
                    },
                    pin_code:{
                        type:Sequelize.STRING,
                        allowNull:true
                    },
                    billing_name : {
                        type: Sequelize.INTEGER,  
                        allowNull: true
                    },
                });
            };
        } catch (err) {
            console.log(err);
        };
    },

    down: async (queryInterface, Sequelize) => {
        try {
            // Defining whether the account table already exist or not.
            const accountTableExists = await queryInterface.tableExists("account");
      
            // Condition for dropping the account table only if the table exist already.
            if (accountTableExists) {
              await queryInterface.dropTable("account");
            };
        } catch (err) {
            console.log(err);
        };
    },
};
