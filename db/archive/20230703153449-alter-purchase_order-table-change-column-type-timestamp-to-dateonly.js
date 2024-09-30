'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering purchase_order table - Changing the delivery_date column from integer to string");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("purchase_order");

      // Condition for changing the delivery_date column delivery_date if it's exist in the table.
      if (tableDefinition && tableDefinition["delivery_date"]) {
        await queryInterface.changeColumn("purchase_order", "delivery_date", {
          type : Sequelize.DATEONLY,
          allowNull : true,
        });
      };
      if (tableDefinition && tableDefinition["date"]) {
        await queryInterface.changeColumn("purchase_order", "date", {
          type : Sequelize.DATEONLY,
          allowNull : true,
        });
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("purchase_order");

      //Condition for changing the delivery_date column if it's not exist in the table.
      if (tableDefinition && tableDefinition["delivery_date"]) {
        await queryInterface.changeColumn("purchase_order", "delivery_date");
      };
      if (tableDefinition && tableDefinition["date"]) {
        await queryInterface.changeColumn("purchase_order", "date");
      };
    } catch(err) {
      console.log(err);
    };
  }
};
