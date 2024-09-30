"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
  

      const tableDefinition = await queryInterface.describeTable(
        "purchase"
      ); 

      console.log("Alter Table: Adding status to purchase table");

      if (tableDefinition && !tableDefinition["vendor_id"]) {
        await queryInterface.addColumn("purchase", "vendor_id", {
          type: Sequelize.INTEGER,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable("purchase");

   
    if (tableDefinition && tableDefinition["vendor_id"]) {
      await queryInterface.removeColumn("purchase", "vendor_id");
    }
  },
};