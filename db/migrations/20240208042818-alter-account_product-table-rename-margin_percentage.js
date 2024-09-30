'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering account_product table - Renaming column from cost_price to last_purchased_price");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("account_product");

      // Condition for renaming the column from cost_price to last_purchased_price if last_purchased_price column doesn't exist in the table
      if (tableDefinition && !tableDefinition["last_purchased_price"]) {
        await queryInterface.renameColumn("account_product", "cost_price", "last_purchased_price");
      }
     
      if (tableDefinition && !tableDefinition["last_purchased_margin_percentage"]) {
        await queryInterface.addColumn("account_product", "last_purchased_margin_percentage", {
            type: Sequelize.STRING,
        });
    }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("account_product");
      
      // Condition for renaming the column from cost_price to last_purchased_price if created_by column exist in the table
      if (tableDefinition && tableDefinition["cost_price"]) {
        await queryInterface.renameColumn("account_product", "last_purchased_price", "cost_price");
      }
      if (tableDefinition && tableDefinition["account_product"]) {
        await queryInterface.removeColumn(
            "last_purchased_margin_percentage",
            "account_product"
        );
    }
    } catch (err) {
      console.log(err);
    }
  }
};

