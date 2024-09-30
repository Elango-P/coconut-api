"use strict";
exports.up = async function up(queryInterface, Sequelize) {
  try {
    console.log("Drop Salary Table ");
    const tableDefinition = await queryInterface.describeTable("salary");

    if (tableDefinition) {
      return queryInterface.dropTable("salary");
    } else {
      return null
    }
  } catch (err) {
    console.log(err);
  }
};

exports.down = function down(queryInterface) {
  return queryInterface.dropTable("salary");
};
