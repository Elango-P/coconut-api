'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Renaming table from purchase_product to bill_product");

      // Defining the purchase_product table value if the table exists already or not.
      const purchaseProductTableDefinition = await queryInterface.tableExists("purchase_product");

      // Defining the bill_product table value if the table exists already or not.
      const billProductTableDefinition = await queryInterface.tableExists("bill_product");

      // Condition for renaming the table from purchase_product to bill_product only if purchase_product table exists and bill_product table doesn't exist.
      if (purchaseProductTableDefinition && !billProductTableDefinition) {
        await queryInterface.renameTable("purchase_product", "bill_product");
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the purchase_product table value if the table exists already or not.
      const purchaseProductTableDefinition = await queryInterface.tableExists("purchase_product");

      // Defining the bill_product table value if the table exists already or not.
      const billProductTableDefinition = await queryInterface.tableExists("bill_product");

      // Condition for renaming the table from bill_product to purchase_product only if bill_product table exists and purchase_product table doesn't exist.
      if (billProductTableDefinition && !purchaseProductTableDefinition) {
        await queryInterface.renameTable("bill_product", "purchase_product");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
