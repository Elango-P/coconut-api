'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Renaming table from Candidate Profile to candidate");

      // Defining the  candidate_profile table value if the table exists already or not.
      const candidateProfileTableDefinition = await queryInterface.tableExists("candidate_profile");

      // Defining the candidate table value if the table exists already or not.
      const candidateTableDefinition = await queryInterface.tableExists("candidate");

      // Condition for renaming the table from  candidate_profile to candidate only if  candidate_profile table exists and candidate table doesn't exist.
      if (candidateProfileTableDefinition && !candidateTableDefinition) {
        await queryInterface.renameTable("candidate_profile", "candidate");
      };
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the  candidate_profile table value if the table exists already or not.
      const candidateProfileTableDefinition = await queryInterface.tableExists("candidate_profile");

      // Defining the candidate table value if the table exists already or not.
      const candidateTableDefinition = await queryInterface.tableExists("candidate");

      // Condition for renaming the table from candidate to  candidate_profile only if candidate table exists and  candidate_profile table doesn't exist.
      if (candidateTableDefinition && !candidateProfileTableDefinition) {
        await queryInterface.renameTable("candidate", "candidate_profile");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
