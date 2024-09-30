"use strict";
module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Console log
            console.log("Creating setting table");

            // Defining whether the setting table already exist or not.
            const settingTableExists = await queryInterface.tableExists("setting");

            // Condition for creating the setting table only if the table doesn't exist already.
            if (!settingTableExists) {
                await queryInterface.createTable("setting", {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    name: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                    object_name: {
                        type: Sequelize.STRING,
                        allowNull: true,
                    },
                    object_id: {
                        type: Sequelize.INTEGER,
                        allowNull: true,
                    },
                    value: {
                        type: Sequelize.TEXT,
                        allowNull: false,
                    },
                    created_by: {
                        type: Sequelize.STRING,
                    },
                    updated_by: {
                        type: Sequelize.STRING,
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
                    company_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false
                    },
                });
            };
        } catch (err) {
            console.log(err);
        };
    },
    
    down: async (queryInterface, Sequelize) => {
        try {
            // Defining whether the setting table already exist or not.
            const settingTableExists = await queryInterface.tableExists("setting");
      
            // Condition for dropping the setting table only if the table exist already.
            if (settingTableExists) {
              await queryInterface.dropTable("setting");
            };
        } catch (err) {
            console.log(err);
        };
    },
};
