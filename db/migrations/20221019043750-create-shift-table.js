"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Console log
            console.log("Creating shift table");

            // Defining whether the shift table already exist or not.
            const shiftTableExists = await queryInterface.tableExists("shift");

            // Condition for creating the shift table only if the table doesn't exist already.
            if (!shiftTableExists) {
                await queryInterface.createTable("shift", {
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
                    status: {
                        type: Sequelize.STRING,
                        allowNull: false,
                    },
                    start_time: {
                        type: Sequelize.DATE,
                        allowNull: true,
                    },
                    end_time: {
                        type: Sequelize.DATE,
                        allowNull: true,
                    },
                    company_id: {
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
                });
            };
        } catch (err) {
            console.log(err);
        };
    },

    down: async (queryInterface, Sequelize) => {
        try {
            // Defining whether the shift table already exist or not.
            const shiftTableExists = await queryInterface.tableExists("shift");
      
            // Condition for dropping the shift table only if the table exist already.
            if (shiftTableExists) {
              await queryInterface.dropTable("shift");
            };
        } catch (err) {
            console.log(err);
        };
    },
};
