'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Renaming table from location to store");
      
      // Defining the location table value if the table exists already or not.
      const locationTableDefinition = await queryInterface.tableExists("location");

      // Defining the store table value if the table exists already or not.
      const storeTableDefinition = await queryInterface.tableExists("store");

      // Condition for renaming the table from location to store only if location table exists.
      if (locationTableDefinition && !storeTableDefinition) {
        await queryInterface.renameTable("location", "store");
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the location table value if the table exists already or not.
      const locationTableDefinition = await queryInterface.tableExists("location");

      // Defining the store table value if the table exists already or not.
      const storeTableDefinition = await queryInterface.tableExists("store");

      // Condition for renaming the table from store to location only if store table exists.
      if (storeTableDefinition && !locationTableDefinition) {
        await queryInterface.renameTable("store", "location");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
