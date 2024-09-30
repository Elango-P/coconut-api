"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        try {
            // Console log
            console.log("Creating apartment table");

            // Defining whether the apartment table already exist or not.
            const apartmentTableExists = await queryInterface.tableExists("apartment");

            // Condition for creating the apartment table only if the table doesn't exist already.
            if (!apartmentTableExists) {
                await queryInterface.createTable("apartment", {
                    id: {
                        allowNull: false,
                        autoIncrement: true,
                        primaryKey: true,
                        type: Sequelize.INTEGER,
                    },
                    name: {
                        type: Sequelize.STRING,
                    },
                    status: {
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
            // Defining whether the apartment table already exist or not.
            const apartmentTableExists = await queryInterface.tableExists("apartment");
      
            // Condition for dropping the apartment table only if the table exist already.
            if (apartmentTableExists) {
              await queryInterface.dropTable("apartment");
            };
        } catch (err) {
            console.log(err);
        };
    },
};
