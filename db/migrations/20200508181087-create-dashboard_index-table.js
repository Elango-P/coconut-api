exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating dashboard_index table");

    // Defining whether the dashboard_index table already exist or not.
    const dashboardIndexTableExists = await queryInterface.tableExists("dashboard_index");

    // Condition for creating the dashboard_index table only if the table doesn't exist already.
    if (!dashboardIndexTableExists) {
      await queryInterface.createTable("dashboard_index", {
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          primaryKey: true,
        },
        user_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        user_status: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        pending_tickets: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        pending_estimated_hours: {
          type: Sequelize.DECIMAL,
          allowNull: true,
          defaultValue: 0.0,
        },
        pending_story_points: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: true,
          defaultValue: 0.0,
        },
        todays_tickets: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        todays_estimated_hours: {
          type: Sequelize.DECIMAL,
          allowNull: true,
          defaultValue: 0.0,
        },
        todays_story_points: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: true,
          defaultValue: 0.0,
        },
        open_tickets: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        open_estimated_hours: {
          type: Sequelize.DECIMAL,
          allowNull: true,
          defaultValue: 0.0,
        },
        open_story_points: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: true,
          defaultValue: 0.0,
        },
        reopen_tickets: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        reopen_estimated_hours: {
          type: Sequelize.DECIMAL,
          allowNull: true,
          defaultValue: 0.0,
        },
        reopen_story_points: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: true,
          defaultValue: 0.0,
        },
        hold_tickets: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        hold_estimated_hours: {
          type: Sequelize.DECIMAL,
          allowNull: true,
          defaultValue: 0.0,
        },
        hold_story_points: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: true,
          defaultValue: 0.0,
        },
        inprogress_tickets: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        inprogress_estimated_hours: {
          type: Sequelize.DECIMAL,
          allowNull: true,
          defaultValue: 0.0,
        },
        inprogress_story_points: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: true,
          defaultValue: 0.0,
        },
        review_tickets: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        review_estimated_hours: {
          type: Sequelize.DECIMAL,
          allowNull: true,
          defaultValue: 0.0,
        },
        review_story_points: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: true,
          defaultValue: 0.0,
        },
        completed_tickets: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        completed_estimated_hours: {
          type: Sequelize.DECIMAL,
          allowNull: true,
          defaultValue: 0.0,
        },
        completed_story_points: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: true,
          defaultValue: 0.0,
        },
        myreview_tickets: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        myreview_estimated_hours: {
          type: Sequelize.DECIMAL,
          allowNull: true,
          defaultValue: 0.0,
        },
        myreview_story_points: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: true,
          defaultValue: 0.0,
        },
        new_tickets: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        new_estimated_hours: {
          type: Sequelize.DECIMAL,
          allowNull: true,
          defaultValue: 0.0,
        },
        new_story_points: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: true,
          defaultValue: 0.0,
        },
        future_tickets: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        future_estimated_hours: {
          type: Sequelize.DECIMAL,
          allowNull: true,
          defaultValue: 0.0,
        },
        future_story_points: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: true,
          defaultValue: 0.0,
        },
        final_review_tickets: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        final_review_estimated_hours: {
          type: Sequelize.DECIMAL,
          allowNull: true,
          defaultValue: 0.0,
        },
        final_review_story_points: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: true,
          defaultValue: 0.0,
        },
        profile_status: {
          type: Sequelize.STRING,
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
      });
    };
  } catch (err) {
    console.log(err);
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the dashboard_index table already exist or not.
    const dashboardIndexTableExists = await queryInterface.tableExists("dashboard_index");

    // Condition for dropping the dashboard_index table only if the table exist already.
    if (dashboardIndexTableExists) {
      await queryInterface.dropTable("dashboard_index");
    };
  } catch (err) {
    console.log(err);
  };
};
