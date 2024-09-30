'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering purchase table - Adding payment_account column");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("purchase");

      // Condition for adding the payment_account column if it doesn't exist in the table.
      if (tableDefinition && !tableDefinition["payment_account"]) {
        await queryInterface.addColumn("purchase", "payment_account", {
          type : Sequelize.STRING,
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
      const tableDefinition = await queryInterface.describeTable("purchase");

      //Condition for removing the payment_account column if it's exist in the table.
      if (tableDefinition && tableDefinition["payment_account"]) {
        await queryInterface.removeColumn("purchase", "payment_account");
      };
    } catch(err) {
      console.log(err);
    };
  }
};
