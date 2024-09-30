'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering payment table - Deleting the payment_account column");

      // Removing the column
      await queryInterface.removeColumn("payment", "payment_account");

    } catch (err) {
      console.log(err);
    }
  }, 

  async down(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Reverting payment table - Restoring the payment_account column");

      // Adding back the column
      await queryInterface.addColumn("payment", "payment_account", {
        type: Sequelize.STRING,
        allowNull: true
      });

    } catch(err) {
      console.log(err);
    }
  }
};
