"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Console log
      console.log("Creating user_index table");

      // Defining whether the user_index table already exist or not.
      const userIndexTableExists = await queryInterface.tableExists(
        "user_index"
      );

      // Condition for creating the user_index table only if the table doesn't exist already.
      if (!userIndexTableExists) {
        await queryInterface.createTable("user_index", {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
          },
          user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          first_name: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          last_name: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          email: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          password: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          role_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },

          profile_photo: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          mobile: {
            type: Sequelize.STRING,
            allowNull: true,
          },

          token: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          active: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 1,
          },
          available_leave_balance: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
          },
          login_time: {
            type: Sequelize.TIME,
            allowNull: true,
          },

          session_id: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          last_loggedin_at: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          updated_by: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
                  date_of_joining: {
                    type: Sequelize.DATE,
                    allowNull: true,
                  },
          status: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          force_daily_update: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
          },

          allow_manual_login: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: 0,
          },

          slack_id: {
            type: Sequelize.STRING,
            allowNull: true,
          },

          company_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          mobile_number1: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          mobile_number2: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          address1: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          address2: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          city: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          state: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          country: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          pin_code: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          media_url: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          media_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },

          ip_address: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          time_zone: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          force_sync: {
            type: Sequelize.BOOLEAN,
            allowNull: true,
          },
          role_name: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          role_permission: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          created_at: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          updated_at: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          deleted_at: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          account_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          last_checkin_at: {
            type: Sequelize.DATE,
            allowNull: true,
          },
        });
      }
    } catch (err) {
      console.log(err);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Defining whether the user_index table already exist or not.
      const userIndexTableExists = await queryInterface.tableExists(
        "user_index"
      );

      // Condition for dropping the user_index table only if the table exist already.
      if (userIndexTableExists) {
        await queryInterface.dropTable("user_index");
      }
    } catch (err) {
      console.log(err);
    }
  },
};
