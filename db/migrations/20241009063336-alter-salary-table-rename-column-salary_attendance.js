module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      const tableDefinition = await queryInterface.describeTable("salary");

      if (tableDefinition && tableDefinition["salary_attendance"]) {
        return queryInterface.renameColumn(
          "salary",
          "salary_attendance",
          "attendance_count"
        );
      } else {
        // If column doesn't exist, resolve migration cleanly
        return Promise.resolve();
      }
    } catch (error) {
      // Handle any errors during migration
      console.error("Error in migration 'up':", error);
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      const tableDefinition = await queryInterface.describeTable("salary");

      if (tableDefinition && tableDefinition["attendance_count"]) {
        return queryInterface.renameColumn(
          "salary",
          "attendance_count",
          "salary_attendance"
        );
      } else {
        // If column doesn't exist, resolve migration cleanly
        return Promise.resolve();
      }
    } catch (error) {
      // Handle any errors during migration rollback
      console.error("Error in migration 'down':", error);
      throw error;
    }
  },
};
