'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering store table - Adding ip_address column");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("store");

      // Condition for adding the ip_address column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["ip_address"]) {
        await queryInterface.addColumn("store", "ip_address", {
          type : Sequelize.DECIMAL,
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
      const tableDefinition = await queryInterface.describeTable("store");

      // Condition for removing the ip_address column if it's exist in the table.
      if (tableDefinition && tableDefinition["ip_address"]) {
        await queryInterface.removeColumn("store", "ip_address");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
