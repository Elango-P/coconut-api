"use strict";
exports.up = async function up(queryInterface, Sequelize) {
  try {
    console.log("Drop Table: location_product_media");
    const tableDefinition = await queryInterface.describeTable("location_product_media");

    if (tableDefinition) {
      return queryInterface.dropTable("location_product_media");
    } else {
      return null
    }
  } catch (err) {
    console.log(err);
  }
};

exports.down = function down(queryInterface) {
  return queryInterface.dropTable("location_product_media");
};
