'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering purchase table - Changing the purchase_date column from integer to string");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("purchase");

      // Condition for changing the purchase_date column purchase_date if it's exist in the table.
      if (tableDefinition && tableDefinition["purchase_date"]) {
        await queryInterface.changeColumn("purchase", "purchase_date", {
          type : Sequelize.DATEONLY,
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

      //Condition for changing the purchase_date column if it's not exist in the table.
      if (tableDefinition && tableDefinition["purchase_date"]) {
        await queryInterface.changeColumn("purchase", "purchase_date");
      };
    } catch(err) {
      console.log(err);
    };
  }
};
