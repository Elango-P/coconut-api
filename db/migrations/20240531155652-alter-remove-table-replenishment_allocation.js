"use strict";
exports.up = async function up(queryInterface, Sequelize) {
  try {
    console.log("Drop Table: ");
    const tableDefinition = await queryInterface.describeTable("replenishment_allocation");

    if (tableDefinition) {
      return queryInterface.dropTable("replenishment_allocation");
    } else {
      return null
    }
  } catch (err) {
    console.log(err);
  }
};

exports.down = function down(queryInterface) {
  return queryInterface.dropTable("replenishment_allocation");
};

