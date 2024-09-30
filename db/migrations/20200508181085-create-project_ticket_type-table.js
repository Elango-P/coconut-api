exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating project_ticket_type table");

    // Defining whether the project_ticket_type table already exist or not.
    const projectTicketTypeTableExists = await queryInterface.tableExists("project_ticket_type");

    // Condition for creating the project_ticket_type table only if the table doesn't exist already.
    if (!projectTicketTypeTableExists) {
      await queryInterface.createTable("project_ticket_type", {
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
          allowNull: true,
        },
        role: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        type_id: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        update_ticket_id_with_jira_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        show_attachment_page_name: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        show_attachment_platform: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        show_attachment_summary: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        allow_to_create_parent_ticket: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
          defaultValue: false,
        },
        show_reviewer: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: null,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
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
          defaultValue: 0,
        },
        show_tasks: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_estimated_hours: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_poa: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_acceptance_criteria: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_severity: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_priority: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_component: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_label: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_affected_version: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_release_version: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_sprint: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_description: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_applicable_devices: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_environment: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_test_steps: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_actual_results: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_expected_results: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_delivery_date: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_initial_eta: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_eta_date: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_eta_time: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_story_points: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_jira_ticket_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_parent_ticket_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_user_impact: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_production_status: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_production_status_notes: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_type: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_build: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_reference_screenshots: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_reporter: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_assignee: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_reviewer: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_project: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_status: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_created_at: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_updated_at: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_jira_created_at: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_completed_at: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_customer_delivery_date: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        show_ticket_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        type: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
        sort: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 0,
        },
        show_sub_tasks: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 1,
        },
        show_jira_assignee: {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: 0,
        },
       
        default_story_point: {
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
        updatedAt: {
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
    // Defining whether the project_ticket_type table already exist or not.
    const projectTicketTypeTableExists = await queryInterface.tableExists("project_ticket_type");

    // Condition for dropping the project_ticket_type table only if the table exist already.
    if (projectTicketTypeTableExists) {
      await queryInterface.dropTable("project_ticket_type");
    };
  } catch (err) {
    console.log(err);
  };
};
