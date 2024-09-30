"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Console log
            console.log("Creating collection table");

            // Defining whether the collection table already exist or not.
            const collectionTableExists = await queryInterface.tableExists("collection");

            // Condition for creating the collection table only if the table doesn't exist already.
            if (!collectionTableExists) {
                await queryInterface.createTable("collection", {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    collection_name: {
                        type: Sequelize.STRING,
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
            // Defining whether the collection table already exist or not.
            const collectionTableExists = await queryInterface.tableExists("collection");
      
            // Condition for dropping the collection table only if the table exist already.
            if (collectionTableExists) {
              await queryInterface.dropTable("collection");
            };
        } catch (err) {
            console.log(err);
        };
    },
};
