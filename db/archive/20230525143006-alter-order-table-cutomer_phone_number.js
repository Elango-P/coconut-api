'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering order table - Adding customer_phone_number column");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("order");

      // Condition for adding the phone_number column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["customer_phone_number"]) {
        await queryInterface.addColumn("order", "customer_phone_number", {
          type : Sequelize.STRING,
          allowNull : true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("order");
      
      // Condition for removing the phone_number column if it's exist in the table
      if (tableDefinition && tableDefinition["customer_phone_number"]) {
        await queryInterface.removeColumn("order", "customer_phone_number");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

