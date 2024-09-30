'use strict';
// 
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Renaming table from bank to account");

      // Defining the bank table value if the table exists already or not.
      const bank = await queryInterface.tableExists("bank");

      // Defining the account table value if the table exists already or not.
      const account = await queryInterface.tableExists("account");

      // Condition for renaming the table from bank to account only if bank table exists.
      if (bank && !account) {
        await queryInterface.renameTable("bank", "account");
      };
    } catch(err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the bank table value if the table exists already or not.
      const bank = await queryInterface.tableExists("bank");
      
      // Defining the account table value if the table exists already or not.
      const account = await queryInterface.tableExists("account");

      // Condition for renaming the table from account to bank only if account table exists.
      if (account && !bank) {
        await queryInterface.renameTable("account", "bank");
      };
    } catch(err) {
      console.log(err);
    };
  }
};
