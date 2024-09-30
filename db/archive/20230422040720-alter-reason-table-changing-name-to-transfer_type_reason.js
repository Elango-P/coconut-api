'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Renaming table from reason to transfer_type_reason");

      // Defining the reason table value if the table exists already or not.
      const reasonTableDefinition = await queryInterface.tableExists("reason");

      // Defining the transfer_type_reason table value if the table exists already or not.
      const transferTypeReasonTableDefinition = await queryInterface.tableExists("transfer_type_reason");

      // Condition for renaming the table from reason to transfer_type_reason only if reason table exists and transfer_type_reason table doesn't exist.
      if (reasonTableDefinition && !transferTypeReasonTableDefinition) {
        await queryInterface.renameTable("reason", "transfer_type_reason");
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the reason table value if the table exists already or not.
      const reasonTableDefinition = await queryInterface.tableExists("reason");

      // Defining the transfer_type_reason table value if the table exists already or not.
      const transferTypeReasonTableDefinition = await queryInterface.tableExists("transfer_type_reason");

      // Condition for renaming the table from transfer_type_reason to reason only if transfer_type_reason table exists and reason table doesn't exist.
      if (transferTypeReasonTableDefinition && !reasonTableDefinition) {
        await queryInterface.renameTable("transfer_type_reason", "reason");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
