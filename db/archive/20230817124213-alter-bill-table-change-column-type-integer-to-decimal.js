'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      console.log("Altering bill table - Changing the gst_amount column type INTEGER to DECIMAL");

      const candidateTableExists = await queryInterface.showAllTables();

      if (candidateTableExists.includes('bill')) {
        const candidateTableDefinition = await queryInterface.describeTable('bill');

        if (candidateTableDefinition && candidateTableDefinition['gst_amount']) {
          await queryInterface.changeColumn('bill', 'gst_amount', {
            type: Sequelize.DECIMAL 
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      const candidateTableExists = await queryInterface.showAllTables();

      if (candidateTableExists.includes('bill')) {
        const candidateTableDefinition = await queryInterface.describeTable('bill');

        if (candidateTableDefinition && candidateTableDefinition['gst_amount']) {
          await queryInterface.changeColumn('bill', 'gst_amount', {
            type: Sequelize.INTEGER 
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
};
