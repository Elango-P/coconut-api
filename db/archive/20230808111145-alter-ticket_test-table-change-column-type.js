'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering ticket_test table - Changing the feature column from integer to string");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("ticket_test");

      // Condition for changing the feature column feature if it's exist in the table.
      if (tableDefinition && tableDefinition["feature"]) {
        await queryInterface.changeColumn("ticket_test", "feature", {
          type : Sequelize.STRING,
          allowNull : true,
        });
      };
      if (tableDefinition && tableDefinition["type"]) {
        await queryInterface.changeColumn("ticket_test", "type", {
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
      const tableDefinition = await queryInterface.describeTable("ticket_test");

      //Condition for changing the feature column if it's not exist in the table.
      if (tableDefinition && tableDefinition["feature"]) {
        await queryInterface.changeColumn("ticket_test", "feature");
      };
      if (tableDefinition && tableDefinition["type"]) {
        await queryInterface.changeColumn("ticket_test", "type");
      };
    } catch(err) {
      console.log(err);
    };
  }
};
