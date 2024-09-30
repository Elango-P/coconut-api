"use strict";
exports.up = async function up(queryInterface, Sequelize) {
  try {
    console.log("Drop Table: ");
    const tableDefinition = await queryInterface.describeTable("ticket");

    if (tableDefinition) {
      return queryInterface.dropTable("ticket");
    } else {
      return null
    }
  } catch (err) {
    console.log(err);
  }
};

exports.down = function down(queryInterface) {
  return queryInterface.dropTable("ticket");
};
