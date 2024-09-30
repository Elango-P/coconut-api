"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try{
            // Console log
            console.log("Creating vendor_product table");

            // Defining whether the vendor_product table already exist or not.
            const vendorProductTableExists = await queryInterface.tableExists("vendor_product");

            // Condition for creating the vendor_product table only if the table doesn't exist already.
            if (!vendorProductTableExists) {
                await queryInterface.createTable("vendor_product", {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    name: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    vendor_id: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    description: {
                        type: Sequelize.TEXT,
                        allowNull: true,
                    },
                    product_id: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    price: {
                        type: Sequelize.FLOAT,
                        allowNull: true,
                    },
                    sale_price: {
                        type: Sequelize.FLOAT,
                        allowNull: true,
                    },
                    vendor_url: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    last_updated_at: {
                        type: Sequelize.DATE,
                        allowNull: true,
                    },
                    imported_at: {
                        type: Sequelize.DATE,
                        allowNull: true,
                    },
                    status: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    import_status: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    company_id : {
                        type: Sequelize.INTEGER,
                        allowNull: false
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
                    barcode: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    brand_id: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    category_id: {
                        type: Sequelize.INTEGER,
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
            // Defining whether the vendor_product table already exist or not.
            const vendorProductTableExists = await queryInterface.tableExists("vendor_product");
        
            // Condition for dropping the vendor_product table only if the table exist already.
            if (vendorProductTableExists) {
                await queryInterface.dropTable("vendor_product");
            };
        } catch (err) {
            console.log(err);
        };
    },
};
