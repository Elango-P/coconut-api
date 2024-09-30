exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating ticket_type table");

    // Defining whether the ticket_type table already exist or not.
    const ticketTypeTableExists = await queryInterface.tableExists("ticket_type");

    // Condition for creating the ticket_type table only if the table doesn't exist already.
    if (!ticketTypeTableExists) {
      await queryInterface.createTable("ticket_type", {
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
        role: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        sort: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        ticket_status: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        test_case_creation_time: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        test_case_execution_time: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        show_test_cases: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 1,
        },
        show_tasks: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 1,
        },
        show_estimated_hours: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        show_poa: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 1,
        },
        show_acceptance_criteria: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 1,
        },
        show_severity: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_priority: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_component: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_label: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_affected_version: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_release_version: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_sprint: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_description: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_applicable_devices: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_environment: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_test_steps: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        show_actual_results: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_expected_results: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_delivery_date: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_initial_eta: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_eta_date: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_eta_time: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        show_story_points: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_jira_ticket_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_parent_ticket_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_user_impact: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_production_status: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_production_status_notes: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_type: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_build: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_reference_screenshots: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_reporter: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_assignee: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_reviewer: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_project: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_status: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_created_at: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_updated_at: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_jira_created_at: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_completed_at: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_customer_delivery_date: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        show_ticket_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
        },
        type: {
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
      });
    };
  } catch (err) {
    console.log(err);
  };
};

exports.down = async function down(queryInterface) {
  try {
    // Defining whether the ticket_type table already exist or not.
    const ticketTypeTableExists = await queryInterface.tableExists("ticket_type");

    // Condition for dropping the ticket_type table only if the table exist already.
    if (ticketTypeTableExists) {
      await queryInterface.dropTable("ticket_type");
    };
  } catch (err) {
    console.log(err);
  };
};
