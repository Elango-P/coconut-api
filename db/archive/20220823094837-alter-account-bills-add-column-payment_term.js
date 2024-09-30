"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding due payment_term to account_bill table");
        
        const tableDefinition = await queryInterface.describeTable("accounts_bill");

        if (tableDefinition && !tableDefinition["payment_term"]) {
            await queryInterface.addColumn("accounts_bill", "payment_term", {
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

        if (tableDefinition && tableDefinition["payment_term"]) {
            await queryInterface.removeColumn("accounts_bill", "payment_term");
        }
    },
};
