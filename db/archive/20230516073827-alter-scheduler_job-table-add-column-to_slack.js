const { STRING } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      console.log("Alter Table: Adding to_slack");
      
      const tableDefinition = await queryInterface.describeTable("scheduler_job");

      if (tableDefinition && !tableDefinition["to_slack"]) {
          await queryInterface.addColumn("scheduler_job", "to_slack", {
              allowNull: true,
              type: Sequelize.STRING,
          });
      }
    } catch(err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    console.log("Alter Table: adding to_slack");
      const tableDefinition = await queryInterface.describeTable("scheduler_job");

      if (tableDefinition && tableDefinition["to_slack"]) {
          await queryInterface.removeColumn("scheduler_job", "to_slack");
      }
  },
};