exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating activity_type table");

    // Defining whether the activity_type table already exist or not.
    const activityTypeTableExists = await queryInterface.tableExists("activity_type");

    // Condition for creating the activity_type table only if the table doesn't exist already.
    if (!activityTypeTableExists) {
      await queryInterface.createTable("activity_type", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        question: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        sort: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        user_roles: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        default_status: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        group: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        type: {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: "Productive",
        },
        is_screenshot_required: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        allow_date_selection: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        is_code_commit_required: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        is_ticket_required: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        max_hours: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        max_entries_per_day: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        auto_add: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        show_executed_test_case_count: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        show_reported_tickets_count: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        approvers: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        show_hour_selection: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        required: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        update_logout: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        update_login: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        validate_pending_activities: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        validate_required_activities: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        },
        user_ids: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        validate_working_hours: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        validate_productive_hours: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        validate_productivity_cost: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        validate_reported_tickets: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        validate_completed_tickets: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        need_explanation: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        allow_manual_entry: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
        validate_eta: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        model: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        ticket_types: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        show_notes: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        slack_id: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        validate_needexplanation_activities: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
        show_in_user_status: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
        image: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        is_ticket_activity: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
        validate_next_working_day_story_points: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        validate_reported_tickets_story_points: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: true,
        },
        validate_pending_review_tickets: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        notify_user: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
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
    // Defining whether the activity_type table already exist or not.
    const activityTypeTableExists = await queryInterface.tableExists("activity_type");

    // Condition for dropping the activity_type table only if the table exist already.
    if (activityTypeTableExists) {
      await queryInterface.dropTable("activity_type");
    };
  } catch (err) {
    console.log(err);
  };
};
