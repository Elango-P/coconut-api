"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Console log
            console.log("Creating sync table");

            // Defining whether the sync table already exist or not.
            const syncTableExists = await queryInterface.tableExists("sync");

            // Condition for creating the sync table only if the table doesn't exist already.
            if (!syncTableExists) {
                await queryInterface.createTable("sync", {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    name: {
                        type: Sequelize.STRING,
                    },
                    object_name: {
                        type: Sequelize.STRING,
                    },
                    object_id: {
                        type: Sequelize.INTEGER,
                    },
                    status: {
                        type: Sequelize.STRING,
                    },
                    result: {
                        type: Sequelize.TEXT,
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
                });
            };
        } catch (err) {
            console.log(err);
        };
    },

    down: async (queryInterface, Sequelize) => {
        try {
            // Defining whether the sync table already exist or not.
            const syncTableExists = await queryInterface.tableExists("sync");

            // Condition for dropping the sync table only if the table exist already.
            if (syncTableExists) {
                await queryInterface.dropTable("sync");
            };
        } catch (err) {
            console.log(err);
        };
    },
};
