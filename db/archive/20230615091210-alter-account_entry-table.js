'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering job table - Changing the type column from string TO integer");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("account_entry");

      // Condition for changing the type column type if it's exist in the table.
      if (tableDefinition && tableDefinition["payment_account"]) {
        await queryInterface.changeColumn("account_entry", "payment_account", {
          type : 'INTEGER USING CAST("payment_account" as INTEGER)',
          allowNull : true,
        });
      };
    } catch (err) {
      console.log(err);
    };
  }, 

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("account_entry");

      //Condition for changing the type column if it's not exist in the table.
      if (tableDefinition && tableDefinition["payment_account"]) {
        await queryInterface.changeColumn("account_entry", "payment_account",{

          type : Sequelize.STRING,
          allowNull : true,

        });
      };
    } catch(err) {
      console.log(err);
    };
  }
};

