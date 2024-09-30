'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Renaming table from location_product to store_product");
      
      // Defining the location_product table value if the table exists already or not.
      const location_product = await queryInterface.tableExists("location_product");

      // Defining the store_product table value if the table exists already or not.
      const store_product = await queryInterface.tableExists("store_product");

      // Condition for renaming the table from location_product to store_product only if location_product table exists.
      if (location_product && !store_product) {
        await queryInterface.renameTable("location_product", "store_product");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the location_product table value if the table exists already or not.
      const location_product = await queryInterface.tableExists("location_product");

      // Defining the store_product table value if the table exists already or not.
      const store_product = await queryInterface.tableExists("store_product");

      // Condition for renaming the table from store_product to location_product only if store_product table exists.
      if (store_product && !location_product) {
        await queryInterface.renameTable("store_product", "location_product");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
