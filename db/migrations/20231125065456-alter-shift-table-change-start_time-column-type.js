module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Changing integer to start_time for start_time in shift table");

      // Define the table
      const tableDefinition = await queryInterface.describeTable("shift");

      // Condition for changing the column type
      if (tableDefinition && tableDefinition["start_time"]) {
        await queryInterface.changeColumn("shift", "start_time", {
          type: Sequelize.TIME,
        });
      }

      if (tableDefinition && tableDefinition["end_time"]) {
        await queryInterface.changeColumn("shift", "end_time", {
          type: Sequelize.TIME,
        });
      }
   
    } catch (err) {
      console.log(err);
    }
  },

  async down(queryInterface, Sequelize) {
    try {
      // Define the table
      const tableDefinition = await queryInterface.describeTable("shift");

      if (tableDefinition && tableDefinition["start_time"]) {
        await queryInterface.changeColumn("shift", "start_time", {
          type: Sequelize.DATE,
        });
      }
      if (tableDefinition && tableDefinition["end_time"]) {
        await queryInterface.changeColumn("shift", "end_time", {
          type: Sequelize.DATE,
        });
      }
    } catch (err) {
      console.log(err);
    }
  },
};
