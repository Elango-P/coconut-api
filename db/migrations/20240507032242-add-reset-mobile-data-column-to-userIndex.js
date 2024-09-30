module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering user_index table - Adding reset_mobile_data column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("user_index");
      // Condition for adding the reset_mobile_data column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["reset_mobile_data"]) {
        await queryInterface.addColumn("user_index", "reset_mobile_data", {
          type: Sequelize.INTEGER,
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
      const tableDefinition = await queryInterface.describeTable("user_index");
      // Condition for removing the reset_mobile_data column if it's exist in the table
      if (tableDefinition && tableDefinition["reset_mobile_data"]) {
        await queryInterface.removeColumn("user_index", "reset_mobile_data");
      }
    } catch (err) {
      console.log(err);
    }
  }
};