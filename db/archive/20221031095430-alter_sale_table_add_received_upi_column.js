'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering sales table - Adding received_amount_cash and received_amount_upi column");

      // Defining the table
      const tableDefinition = await queryInterface.describeTable("sales");

      // Condition for adding the received_amount_cash and received_amount_upi.0 column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["received_amount_cash"]) {
        await queryInterface.addColumn("sales", "received_amount_cash", {
          type: Sequelize.DECIMAL,
          allowNull: true,
        });
      }

      if (tableDefinition && !tableDefinition["received_amount_upi"]) {
        await queryInterface.addColumn("sales", "received_amount_upi", {
          type: Sequelize.DECIMAL,
          allowNull: true,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("sales");

      // Condition for removing the received_amount_cash and received_amount_upi column if it's exist in the table
      if (tableDefinition && tableDefinition["received_amount_cash"]) {
        await queryInterface.removeColumn("sales", "received_amount_cash");
      }

      if (tableDefinition && tableDefinition["received_amount_upi"]) {
        await queryInterface.removeColumn("sales", "received_amount_upi");
      }
    } catch (err) {
      console.log(err);
    }
  }
};

