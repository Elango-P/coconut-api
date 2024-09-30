'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering customer table - Adding country column");
      
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("customer");

      // Condition for adding the country column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["country"]) {
        await queryInterface.addColumn("customer", "country", {
          type : Sequelize.STRING,
          allowNull : true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("customer");
      
      // Condition for removing the country column if it's exist in the table
      if (tableDefinition && tableDefinition["country"]) {
        await queryInterface.removeColumn("customer", "country");
      }
    } catch (err) {
      console.log(err);
    }
  }
};
