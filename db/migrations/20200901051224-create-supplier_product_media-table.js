"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Console log
            console.log("Creating supplier_product_media table");

            // Defining whether the supplier_product_media table already exist or not.
            const supplierProductMediaTableExists = await queryInterface.tableExists("supplier_product_media");

            // Condition for creating the supplier_product_media table only if the table doesn't exist already.
            if (!supplierProductMediaTableExists) {
                await queryInterface.createTable("supplier_product_media", {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    supplier_product_id: {
                        type: Sequelize.INTEGER,
                    },
                    image_url: {
                        type: Sequelize.TEXT,
                        allowNull: true,
                    },
                    position : {
                        type: Sequelize.STRING,  
                        allowNull: true
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
                        allowNull: false,
                        type: Sequelize.DATE,
                    },
                    deletedAt: {
                        allowNull: true,
                        type: Sequelize.DATE,
                    },
                });
            };
        } catch (err) {
            console.log(err);
        };
    },

    down: async (queryInterface, Sequelize) => {
        try {
            // Defining whether the supplier_product_media table already exist or not.
            const supplierProductMediaTableExists = await queryInterface.tableExists("supplier_product_media");
      
            // Condition for dropping the supplier_product_media table only if the table exist already.
            if (supplierProductMediaTableExists) {
              await queryInterface.dropTable("supplier_product_media");
            };
        } catch (err) {
            console.log(err);
        };
    },
};
