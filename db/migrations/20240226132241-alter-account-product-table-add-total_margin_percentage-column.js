'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering account_product table - Adding scheme_discount_percentage, cash_discount_percentage, total_margin_percentage column");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("account_product");

      // Condition for adding the scheme_discount_percentage column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["scheme_discount_percentage"]) {
        await queryInterface.addColumn("account_product", "scheme_discount_percentage", {
          type: Sequelize.DECIMAL,
          allowNull: true,
        });
      }

       // Condition for adding the cash_discount_percentage column if it doesn't exist in the table
       if (tableDefinition && !tableDefinition["cash_discount_percentage"]) {
        await queryInterface.addColumn("account_product", "cash_discount_percentage", {
          type: Sequelize.DECIMAL,
          allowNull: true,
        });
      }

       // Condition for adding the total_margin_percentage column if it doesn't exist in the table
       if (tableDefinition && !tableDefinition["total_margin_percentage"]) {
        await queryInterface.addColumn("account_product", "total_margin_percentage", {
          type: Sequelize.DECIMAL,
          allowNull: true,
        });
      }

    } catch (err) {
      console.log(err);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("account_product");

      // Condition for removing the scheme_discount_percentage column if it's exist in the table
      if (tableDefinition && tableDefinition["scheme_discount_percentage"]) {
        await queryInterface.removeColumn("account_product", "scheme_discount_percentage");
      }

      // Condition for removing the cash_discount_percentage column if it's exist in the table
      if (tableDefinition && tableDefinition["cash_discount_percentage"]) {
        await queryInterface.removeColumn("account_product", "cash_discount_percentage");
      }

       // Condition for removing the total_margin_percentage column if it's exist in the table
       if (tableDefinition && tableDefinition["total_margin_percentage"]) {
        await queryInterface.removeColumn("account_product", "total_margin_percentage");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

