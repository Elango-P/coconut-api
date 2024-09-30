'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering order_product table - Changing the order_date column from integer to string");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("order_product");

      // Condition for changing the order_date column order_date if it's exist in the table.
      if (tableDefinition && tableDefinition["order_date"]) {
        await queryInterface.changeColumn("order_product", "order_date", {
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
      const tableDefinition = await queryInterface.describeTable("order_product");

      //Condition for changing the order_date column if it's not exist in the table.
      if (tableDefinition && tableDefinition["order_date"]) {
        await queryInterface.changeColumn("order_product", "order_date");
      };
    } catch(err) {
      console.log(err);
    };
  }
};
