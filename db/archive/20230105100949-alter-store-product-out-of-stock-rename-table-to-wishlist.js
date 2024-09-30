'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Renaming table from store-product-out-of-stock to wishlist");

      // Defining the inventory_transfer_product table value if the table exists already or not.
      const store_product_out_of_stock = await queryInterface.tableExists("store_product_out_of_stock");

      // Defining the transfer_product table value if the table exists already or not.
      const wishlist = await queryInterface.tableExists("wishlist");

      // Condition for renaming the table from inventory_transfer_product to transfer_product only if inventory_transfer_product table exists.
      if ( store_product_out_of_stock && !wishlist) {
        await queryInterface.renameTable("store_product_out_of_stock", "wishlist");
      };
    } catch(err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
    
      const store_product_out_of_stock = await queryInterface.tableExists("store_product_out_of_stock");
      
    
      const wishlist = await queryInterface.tableExists("wishlist");

    
      if ( !store_product_out_of_stock && wishlist) {
        await queryInterface.renameTable("wishlist", "store_product_out_of_stock");
      };
    } catch(err) {
      console.log(err);
    };
  }
};
