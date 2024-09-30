'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Renaming table from vendor to account");

      // Defining the vendor table value if the table exists already or not.
      const vendorTableDefinition = await queryInterface.tableExists("vendor");

      // Defining the account table value if the table exists already or not.
      const accountTableDefinition = await queryInterface.tableExists("account");

      // Condition for renaming the table from vendor to account only if vendor table exists and account table doesn't exist.
      if (vendorTableDefinition && !accountTableDefinition) {
        await queryInterface.renameTable("vendor", "account");
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the vendor table value if the table exists already or not.
      const vendorTableDefinition = await queryInterface.tableExists("vendor");

      // Defining the account table value if the table exists already or not.
      const accountTableDefinition = await queryInterface.tableExists("account");

      // Condition for renaming the table from account to vendor only if account table exists and vendor table doesn't exist.
      if (accountTableDefinition && !vendorTableDefinition) {
        await queryInterface.renameTable("account", "vendor");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
