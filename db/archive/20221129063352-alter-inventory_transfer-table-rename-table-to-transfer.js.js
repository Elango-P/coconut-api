'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Renaming table from inventory_transfer to transfer");

      // Defining the inventory_transfer table value if the table exists already or not.
      const inventory_transfer = await queryInterface.tableExists("inventory_transfer");

      // Defining the transfer table value if the table exists already or not.
      const transfer = await queryInterface.tableExists("transfer");

      // Condition for renaming the table from inventory_transfer to transfer only if inventory_transfer table exists.
      if (inventory_transfer && !transfer) {
        await queryInterface.renameTable("inventory_transfer", "transfer");
      };
    } catch(err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the inventory_transfer table value if the table exists already or not.
      const inventory_transfer = await queryInterface.tableExists("inventory_transfer");
      
      // Defining the transfer table value if the table exists already or not.
      const transfer = await queryInterface.tableExists("transfer");

      // Condition for renaming the table from transfer to inventory_transfer only if transfer table exists.
      if (transfer && !inventory_transfer) {
        await queryInterface.renameTable("transfer", "inventory_transfer");
      };
    } catch(err) {
      console.log(err);
    };
  }
};
