"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding status in user_role");
        
        const tableDefinition = await queryInterface.describeTable("user_role");

        if (tableDefinition && !tableDefinition["status"]) {
            await queryInterface.addColumn("user_role", "status", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        
      }
    } catch(err) {
      console.log(err);
    }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("user_role");

        if (tableDefinition && tableDefinition["status"]) {
            await queryInterface.removeColumn("user_role", "status");
        }

    },
};

