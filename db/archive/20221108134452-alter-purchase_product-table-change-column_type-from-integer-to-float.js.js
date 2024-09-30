'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering purchase_product table - Changing the quantity column type from integer to float");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("purchase_product");

      // Condition for changing the quantity column type if it's exist in the table.
      if (tableDefinition && tableDefinition["quantity"]) {
        await queryInterface.changeColumn("purchase_product", "quantity", {
          type : Sequelize.FLOAT,
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
      const tableDefinition = await queryInterface.describeTable("purchase_product");

      //Condition for changing the quantity column if it's not exist in the table.
      if (tableDefinition && tableDefinition["quantity"]) {
        await queryInterface.changeColumn("purchase_product", "quantity");
      };
    } catch(err) {
      console.log(err);
    };
  }
};
