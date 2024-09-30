
"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Console log
            console.log("Creating store table");

            // Defining whether the store table already exist or not.
            const storeTableExists = await queryInterface.tableExists("store");

            // Condition for creating the store table only if the table doesn't exist already.
            if (!storeTableExists) {
                await queryInterface.createTable("store", {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    name: {
                        type: Sequelize.STRING,
                    },
                    status: {
                        type: Sequelize.STRING,
                    },
                    shopify_store_name: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    shopify_admin_api_version: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    shopify_api_key: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    shopify_password: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    allowed_shift: {
                        type: Sequelize.STRING,
                        allowNull: true,
                      },
                    company_id : {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                    createdAt: {
                        allowNull: false,
                        type: Sequelize.DATE,
                    },
                    updatedAt: {
                        allowNull: true,
                        type: Sequelize.DATE,
                    },
                    deletedAt: {
                        allowNull: true,
                        type: Sequelize.DATE,
                    },
                    start_date:{
                        allowNull: true,
                        type: Sequelize.DATE,   
                    },
                    featured_media_url: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    shopify_shop_name: {
                        type: Sequelize.STRING,
                        allowNull: true
                    },
                    address1: {
                        type: Sequelize.TEXT,
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
                    mobile_number2: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    address2: {
                        type: Sequelize.TEXT,
                        allowNull: true,
                    },
                    city: {
                        type: Sequelize.STRING,
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
                    pin_code: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    allow_sale: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    end_date: {
                        type: Sequelize.DATE,
                        allowNull: true,
                    },
                    ip_address: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    minimum_cash_in_store: {
                        type: Sequelize.DECIMAL,
                        allowNull: true,
                    },
                    color: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    print_name: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    distribution_center: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    allow_purchase: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    sales_settlement_required: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    latitude:{
                        type:Sequelize.STRING,
                        allowNull:true
                      },
                      
                      longitude:{
                     type:Sequelize.STRING,
                     allowNull:true
                    
                    
                      },
                    type: {
                        type: Sequelize.INTEGER,
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
            // Defining whether the store table already exist or not.
            const storeTableExists = await queryInterface.tableExists("store");
      
            // Condition for dropping the store table only if the table exist already.
            if (storeTableExists) {
              await queryInterface.dropTable("store");
            };
        } catch (err) {
            console.log(err);
        };
    },
};
