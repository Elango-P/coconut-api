'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering purchase table - Adding billing_name column");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("purchase");

      // Condition for adding the billing_name column if it doesn't exist in the table.
      if (tableDefinition && !tableDefinition["billing_name"]) {
        await queryInterface.addColumn("purchase", "billing_name", {
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

      //Condition for removing the billing_name column if it's exist in the table.
      if (tableDefinition && tableDefinition["billing_name"]) {
        await queryInterface.removeColumn("purchase", "billing_name");
      };
    } catch(err) {
      console.log(err);
    };
  }
};
