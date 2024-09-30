const { STRING } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding working days");
      
      const tableDefinition = await queryInterface.describeTable("user_employment");

      if (tableDefinition && !tableDefinition["working_days"]) {
          await queryInterface.addColumn("user_employment", "working_days", {
              allowNull: true,
              type: Sequelize.STRING,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log("Alter Table: adding working days");
      const tableDefinition = await queryInterface.describeTable("user_employment");

      if (tableDefinition && tableDefinition["working_days"]) {
          await queryInterface.removeColumn("user_employment", "working_days");
      }
  },
};