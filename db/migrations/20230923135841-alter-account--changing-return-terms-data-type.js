'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Alterin account table - Changing the payment column from integer to string");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("account");

      // Condition for changing the eta column eta if it's exist in the table.
      if (tableDefinition && tableDefinition["return_terms"]) {
        await queryInterface.changeColumn("account", "return_terms", {
          type : Sequelize.TEXT,
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
      const tableDefinition = await queryInterface.describeTable("account",);

      //Condition for changing the eta column if it's not exist in the table.
      if (tableDefinition && tableDefinition["return_terms"]) {
        await queryInterface.changeColumn("account", "return_terms",{
          type : Sequelize.STRING,
          allowNull : true,

        });
      };
    } catch(err) {
      console.log(err);
    };
  }
};