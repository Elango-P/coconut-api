'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Renaming table from inventory_transfer_product to transfer_product");

      // Defining the inventory_transfer_product table value if the table exists already or not.
      const inventory_transfer_product = await queryInterface.tableExists("inventory_transfer_product");

      // Defining the transfer_product table value if the table exists already or not.
      const transfer_product = await queryInterface.tableExists("transfer_product");

      // Condition for renaming the table from inventory_transfer_product to transfer_product only if inventory_transfer_product table exists.
      if (inventory_transfer_product && !transfer_product) {
        await queryInterface.renameTable("inventory_transfer_product", "transfer_product");
      };
    } catch(err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the inventory_transfer_product table value if the table exists already or not.
      const inventory_transfer_product = await queryInterface.tableExists("inventory_transfer_product");
      
      // Defining the transfer_product table value if the table exists already or not.
      const transfer_product = await queryInterface.tableExists("transfer_product");

      // Condition for renaming the table from transfer_product to inventory_transfer_product only if transfer_product table exists.
      if (transfer_product && !inventory_transfer_product) {
        await queryInterface.renameTable("transfer_product", "inventory_transfer_product");
      };
    } catch(err) {
      console.log(err);
    };
  }
};
