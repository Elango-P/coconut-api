'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("status");

      // Condition for changing the eta column eta if it's exist in the table.
      if (tableDefinition && !tableDefinition["allow_cancel"]) {
        await queryInterface.addColumn("status", "allow_cancel", {
          type : Sequelize.INTEGER,
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
      if (tableDefinition && tableDefinition["allow_cancel"]) {
        await queryInterface.removeColumn("account", "allow_cancel");
      };
    } catch(err) {
      console.log(err);
    };
  }
};