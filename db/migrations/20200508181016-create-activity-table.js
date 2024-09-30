exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating activity table");

    // Defining whether the activity table already exist or not.
    const activityTableExists = await queryInterface.tableExists("activity");

    // Condition for creating the activity table only if the table doesn't exist already.
    if (!activityTableExists) {
      await queryInterface.createTable("activity", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        activity: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        activity_type: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        notes: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        activity_type_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        actual_hours: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        owner_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        date: {
          type: Sequelize.DATEONLY,
          allowNull: false,
        },
        ticket_internal_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        cost: {
          type: Sequelize.DECIMAL,
          allowNull: true,
        },
        ip_address: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        start_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        end_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        approved_by: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        approved_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        explanation: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        model_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        estimated_hours: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        system_hours: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
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
      });
    };
  } catch (err) {
    console.log(err);
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the activity table already exist or not.
    const activityTableExists = await queryInterface.tableExists("activity");

    // Condition for dropping the activity table only if the table exist already.
    if (activityTableExists) {
      await queryInterface.dropTable("activity");
    };
  } catch (err) {
    console.log(err);
  };
};
