exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating ticket_status table");

    // Defining whether the ticket_status table already exist or not.
    const ticketStatusTableExists = await queryInterface.tableExists("ticket_status");

    // Condition for creating the ticket_status table only if the table doesn't exist already.
    if (!ticketStatusTableExists) {
      await queryInterface.createTable("ticket_status", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        project_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        sort: {
          type: Sequelize.DECIMAL,
          allowNull: true,
          defaultValue: 0.0,
        },
        group_id: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        roles: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        jira_status_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        summary_required: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        description_required: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        test_steps_required: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        expected_results_required: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        actual_results_required: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        acceptance_criteria_required: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        production_status_required: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        production_status_notes_required: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        user_impact_required: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        attachment_required: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        applicable_devices_required: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        environment_required: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        build_required: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        release_version_required: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        ETA_required: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        assignee_required: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        required_review: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: null,
        },
        jira_ticket_id_required: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        allow_test_case_status_change: {
          type: Sequelize.BOOLEAN,
          allowNull: null,
          defaultValue: false,
        },
        allow_task_status_change: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        story_points_required: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        label_required: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        severity_required: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        allow_task_add: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        allow_to_add_test_case: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        reset_reviewer: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
        },
        allow_subticket_create: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        default_assignee: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        force_default_assignee: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        task_validation: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        minimum_test_count: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        notify_assignee: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        notify_reporter: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        notify_reviewer: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        default_story_points: {
          type: Sequelize.DECIMAL,
          allowNull: true,
          defaultValue: null,
        },
        set_completed_at: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: false,
        },
        default_reviewer: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        default_eta: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        test_validation: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        affected_version_required: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        validate_reported_tickets: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        project_type_id: {
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
  }
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the ticket_status table already exist or not.
    const ticketStatusTableExists = await queryInterface.tableExists("ticket_status");

    // Condition for dropping the ticket_status table only if the table exist already.
    if (ticketStatusTableExists) {
      await queryInterface.dropTable("ticket_status");
    };
  } catch (err) {
    console.log(err);
  };
};
