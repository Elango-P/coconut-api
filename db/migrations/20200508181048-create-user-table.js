exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating user table");

    // Defining whether the user table already exist or not.
    const userTableExists = await queryInterface.tableExists("user");

    // Condition for creating the user table only if the table doesn't exist already.
    if (!userTableExists) {
      await queryInterface.createTable("user", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        last_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        password: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        role: {
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
        time_zone: {
          type: Sequelize.STRING,
          allowNull: true,
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
        created_at: {
          allowNull: false,
          type: Sequelize.DATE,
        },
        updated_at: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        deleted_at: {
          allowNull: true,
          type: Sequelize.DATE,
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

        force_sync: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        otp_createdAt: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        otp: {
          type: Sequelize.STRING,
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
};
exports.down = async function down(queryInterface) {
  try {
    // Defining whether the user table already exist or not.
    const userTableExists = await queryInterface.tableExists("user");

    // Condition for dropping the user table only if the table exist already.
    if (userTableExists) {
      await queryInterface.dropTable("user");
    }
  } catch (err) {
    console.log(err);
  }
};
