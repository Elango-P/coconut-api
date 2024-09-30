"use strict";
exports.up = async function up(queryInterface, Sequelize) {
  try {
    console.log("Drop Table: store_product_media");
    const tableDefinition = await queryInterface.describeTable("store_product_media");

    if (tableDefinition) {
      return queryInterface.dropTable("store_product_media");
    } else {
      return null
    }
  } catch (err) {
    console.log(err);
  }
};

exports.down = function down(queryInterface) {
  return queryInterface.dropTable("store_product_media");
};
