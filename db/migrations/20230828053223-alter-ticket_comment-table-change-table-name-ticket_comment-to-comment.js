"use strict";

module.exports = {
    up: async (queryInterface, Sequelize) => {
        console.log("Rename ticket_comment table to comment");
        await queryInterface.renameTable("ticket_comment", "comment");
    },



  async down (queryInterface, Sequelize) {
    await queryInterface.renameTable("comment", "ticket_comment");
  }
};
