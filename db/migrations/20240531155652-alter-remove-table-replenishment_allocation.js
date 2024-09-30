"use strict";

exports.up = async function up(queryInterface, Sequelize) {
  try {
    console.log("Attempting to drop table: replenishment_allocation");
    await queryInterface.dropTable("replenishment_allocation");
    console.log("Table dropped successfully.");
  } catch (err) {
    // Handle the error by logging it
    console.log("Error during dropping table:", err.message);
  }
};

exports.down = async function down(queryInterface, Sequelize) {
  try {
    // Add logic to recreate the table if needed
    // Example:
    await queryInterface.createTable("replenishment_allocation", {
      // Define your table columns here
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // Add other columns as necessary
    });
    console.log("Table replenishment_allocation created successfully.");
  } catch (err) {
    console.log("Error during creating table:", err.message);
  }
};
