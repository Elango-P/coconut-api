"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Console log
            console.log("Creating wishlist table");

            // Defining whether the wishlist table already exist or not.
            const wishlistTableExists = await queryInterface.tableExists("wishlist");

            // Condition for creating the wishlist table only if the table doesn't exist already.
            if (!wishlistTableExists) {
                await queryInterface.createTable("wishlist", {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    date:{
                      allowNull:true,
                      type: Sequelize.DATEONLY
                    },
                    product_id: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    record_number: {
                      type: Sequelize.INTEGER,
                      allowNull: true,
                  },
                    store_id: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    status: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    createdAt: {
                        type: Sequelize.DATE,
                        allowNull: false,
                    },
                    updatedAt: {
                        type: Sequelize.DATE,
                        allowNull: false,
                    },
                    deletedAt: {
                        type: Sequelize.DATE,
                        allowNull: true,
                    },
                    company_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                });
            };
        } catch (err) {
            console.log(err);
        };
    },

    down: async (queryInterface, Sequelize) => {
        try {
            // Defining whether the wishlist table already exist or not.
            const wishlistTableExists = await queryInterface.tableExists("wishlist");
      
            // Condition for dropping the wishlist table only if the table exist already.
            if (wishlistTableExists) {
              await queryInterface.dropTable("wishlist");
            };
        } catch (err) {
            console.log(err);
        };
    },
};