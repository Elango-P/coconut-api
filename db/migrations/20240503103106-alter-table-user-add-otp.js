module.exports = {
  async up(queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Altering user table - Adding otp column");
      // Defining the table
      const tableDefinition = await queryInterface.describeTable("user");
      // Condition for adding the otp column if it doesn't exist in the table
      if (tableDefinition && !tableDefinition["otp"]) {
        await queryInterface.addColumn("user", "otp", {
          type: Sequelize.STRING,
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
      const tableDefinition = await queryInterface.describeTable("user");
      // Condition for removing the otp column if it's exist in the table
      if (tableDefinition && tableDefinition["otp"]) {
        await queryInterface.removeColumn("user", "otp");
      }
    } catch (err) {
      console.log(err);
    }
  }
};