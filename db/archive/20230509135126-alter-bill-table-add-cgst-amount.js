"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
      try {
        console.log("Alter Table: Adding cgst to bill table");
        
        const tableDefinition = await queryInterface.describeTable("bill");

        if (tableDefinition && !tableDefinition["cgst_amount"]) {
            await queryInterface.addColumn("bill", "cgst_amount", {
                allowNull: true,
                type: Sequelize.DECIMAL,
            });
        }
      } catch(err) {
        console.log(err);
      }
    },

    down: async (queryInterface, Sequelize) => {
      console.log("Alter Table: Removing cgst to bill table");
        const tableDefinition = await queryInterface.describeTable("bill");

        if (tableDefinition && tableDefinition["cgst_amount"]) {
            await queryInterface.removeColumn("bill", "cgst_amount");
        }
    },
};