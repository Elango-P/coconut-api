'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Console log
      console.log("Creating ticket_index table");

      // Defining the ticket_index table if it already exists or not.
      const ticketTable = await queryInterface.tableExists("ticket_index");

      // Condition for creating the ticket_index table only if it does not exist already.
      if (!ticketTable) {
        await queryInterface.createTable("ticket_index", {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          ticket_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          ticket_number: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          summary: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          assignee_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          company_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          eta: {
            type: Sequelize.DATEONLY,
            allowNull: true,
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          deletedAt: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          reporter_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          sprint: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          project_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          status: {
            type: Sequelize.INTEGER,
            allowNull: true
          },
          type_id: {
            type: Sequelize.INTEGER,
            allowNull: true
          },
          severity_id: {
            type: Sequelize.INTEGER,
            allowNull: true
          },
          priority: {
            type: Sequelize.INTEGER,
            allowNull: true
          },
          acceptance_criteria: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          environment: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          test_step: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          actual_results: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          expected_results: {
            type: Sequelize.TEXT,
            allowNull: true
          },
          story_points: {
            type: Sequelize.DECIMAL,
            allowNull: true
          },
          reviewer: {
            type: Sequelize.INTEGER,
            allowNull: true
          },
          completed_at: {
            type: Sequelize.DATE,
            allowNull: true
          },
          actual_hours: {
            type: Sequelize.INTEGER,
            allowNull: true
          },
          system_hours: {
            type: Sequelize.INTEGER,
            allowNull: true
          },
          status_group_id: {
            type: Sequelize.INTEGER,
            allowNull: true
          },
          ticket_date: {
            allowNull: true,
            type: Sequelize.DATEONLY,
          },
        });
      }; 
    } catch (err) {
      console.log(err);
    };
  },

  async down (queryInterface, Sequelize) {
    try {
      // Defining the ticket_index table if it already exists or not.
      const ticketTable = await queryInterface.tableExists("ticket_index");

      // Condition for dropping the ticket_index table only if it exist already.
      if (ticketTable) {
        await queryInterface.dropTable("ticket_index");
      };
    } catch (err) {
      console.log(err);
    };
  },
};
