"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Console log
            console.log("Creating user_role table");

            // Defining whether the user_role table already exist or not.
            const userRoleTableExists = await queryInterface.tableExists("user_role");

            // Condition for creating the user_role table only if the table doesn't exist already.
            if (!userRoleTableExists) {
                await queryInterface.createTable("user_role", {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    role_name: {
                        type: Sequelize.STRING,
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
                    company_id: {
                        type: Sequelize.INTEGER,
                        allowNull: false,
                    },
                    status: {
                        type: Sequelize.STRING,
                        allowNull: true
                    },
                    allowed_shifts: {
                        type: Sequelize.STRING,
                        allowNull: true
                    },
                    allowed_ip_address: {
                        type: Sequelize.STRING,
                        allowNull: true
                    },
                    allowed_locations: {
                        type: Sequelize.STRING,
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
            // Defining whether the user_role table already exist or not.
            const userRoleTableExists = await queryInterface.tableExists("user_role");
      
            // Condition for dropping the user_role table only if the table exist already.
            if (userRoleTableExists) {
              await queryInterface.dropTable("user_role");
            };
        } catch (err) {
            console.log(err);
        };
    },
};
