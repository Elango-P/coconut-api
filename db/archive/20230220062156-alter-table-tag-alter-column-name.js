"use strict";
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      console.log("change dataType for name");
      const tableDefinition = await queryInterface.describeTable("tag");

      if (tableDefinition && tableDefinition["name"]) {

      await queryInterface.changeColumn("tag", "name", {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
    } catch (err) {
      console.log(err);
    }
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn("tag", "name", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },
};
