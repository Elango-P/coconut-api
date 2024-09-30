"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        try{
            // Console log
            console.log("Creating store_product table");

            // Defining whether the store_product table already exist or not.
            const storeProductTableExists = await queryInterface.tableExists("store_product");

            // Condition for creating the store_product table only if the table doesn't exist already.
            if (!storeProductTableExists) {
                await queryInterface.createTable("store_product", {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    product_id: {
                        type: Sequelize.INTEGER,
                    },
                    store_id: {
                        type: Sequelize.INTEGER,
                    },
                    createdAt: {
                        type: Sequelize.DATE,
                    },
                    updatedAt: {
                        type: Sequelize.DATE,
                    },
                    deletedAt: {
                        type: Sequelize.DATE,
                    },
                    company_id : {
                        type: Sequelize.INTEGER,
                        allowNull: false
                    },
                    quantity: {
                        type: Sequelize.FLOAT,
                    },
                    min_quantity: {
                        type: Sequelize.INTEGER,
                    },
                    max_quantity: {
                        type: Sequelize.INTEGER,
                    },
                    status: {
                        type: Sequelize.STRING,
                    },
                    last_order_date: {
                        type: Sequelize.DATE,
                        allowNull: true,
                    },
                    last_stock_entry_date: {
                        type: Sequelize.DATE,
                        allowNull: true,
                    },
                    order_quantity: {
                        type: Sequelize.DECIMAL,
                        allowNull: true
                    },
                    replenish_quantity: {
                        type: Sequelize.DECIMAL,
                        allowNull: true
                    },
                    min_order_quantity: {
                        type: Sequelize.INTEGER,
                        allowNull: true
                    },
                    max_order_quantity: {
                        type: Sequelize.INTEGER,
                        allowNull: true
                    },
                    return_quantity: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    system_quantity: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    discrepancy_quantity:{
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    average_order_quantity: {
                        type: Sequelize.DECIMAL,
                        allowNull: true,
                    },
                });
            };
        } catch(err){
            console.log(err);
        };
    },

    down: async (queryInterface, Sequelize) => {
        try {
            // Defining whether the store_product table already exist or not.
            const storeProductTableExists = await queryInterface.tableExists("store_product");
      
            // Condition for dropping the store_product table only if the table exist already.
            if (storeProductTableExists) {
              await queryInterface.dropTable("store_product");
            };
        } catch (err) {
            console.log(err);
        };
    },
};
