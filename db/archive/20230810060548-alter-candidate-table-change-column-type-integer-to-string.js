'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      console.log("Altering candidate table - Changing the joined_month column type STRING to STRING");

      const candidateTableExists = await queryInterface.showAllTables();

      if (candidateTableExists.includes('candidate')) {
        const candidateTableDefinition = await queryInterface.describeTable('candidate');

        if (candidateTableDefinition && candidateTableDefinition['joined_month']) {
          await queryInterface.changeColumn('candidate', 'joined_month', {
            type: Sequelize.STRING // Corrected data type
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

      if (candidateTableExists.includes('candidate')) {
        const candidateTableDefinition = await queryInterface.describeTable('candidate');

        if (candidateTableDefinition && candidateTableDefinition['joined_month']) {
          await queryInterface.changeColumn('candidate', 'joined_month', {
            type: Sequelize.INTEGER // Corrected data type
          });
        }
      }
    } catch (err) {
      console.log(err);
    }
  }
};
