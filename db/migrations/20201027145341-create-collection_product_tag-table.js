"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Console log
            console.log("Creating collection_product_tag table");

            // Defining whether the collection_product_tag table already exist or not.
            const collectionProductTagTableExists = await queryInterface.tableExists("collection_product_tag");

            // Condition for creating the collection_product_tag table only if the table doesn't exist already.
            if (!collectionProductTagTableExists) {
                await queryInterface.createTable("collection_product_tag", {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    collection_id: {
                        allowNull: false,
                        type: Sequelize.INTEGER,
                    },
                    tag_id: {
                        allowNull: false,
                        type: Sequelize.INTEGER,
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
            // Defining whether the collection_product_tag table already exist or not.
            const collectionProductTagTableExists = await queryInterface.tableExists("collection_product_tag");
      
            // Condition for dropping the collection_product_tag table only if the table exist already.
            if (collectionProductTagTableExists) {
                await queryInterface.dropTable("collection_product_tag");
            };
        } catch (err) {
            console.log(err);
        };
    },
};
