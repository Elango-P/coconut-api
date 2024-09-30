"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding staus to account_bill table");
        
        const tableDefinition = await queryInterface.describeTable("accounts_bill");

        if (tableDefinition && !tableDefinition["status"]) {
            await queryInterface.addColumn("accounts_bill", "status", {
                type: Sequelize.STRING,
                allowNull: true,
            });
        }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("accounts_bill");

        if (tableDefinition && tableDefinition["status"]) {
            await queryInterface.removeColumn("accounts_bill", "status");
        }
    },
};
