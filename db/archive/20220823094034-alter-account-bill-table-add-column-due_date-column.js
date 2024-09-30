"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding due date to account_bill table");
        
        const tableDefinition = await queryInterface.describeTable("accounts_bill");

        if (tableDefinition && !tableDefinition["due_date"]) {
            await queryInterface.addColumn("accounts_bill", "due_date", {
                type: Sequelize.DATE,
                allowNull: true,
            });
        }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
        const tableDefinition = await queryInterface.describeTable("accounts_bill");

        if (tableDefinition && tableDefinition["due_date"]) {
            await queryInterface.removeColumn("accounts_bill", "due_date");
        }
    },
};
