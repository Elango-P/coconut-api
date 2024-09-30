exports.up = async function up(queryInterface, Sequelize) {
  try {
    // Console log
    console.log("Creating index_ticket table");

    // Defining whether the index_ticket table already exist or not.
    const indexTicketTableExists = await queryInterface.tableExists("index_ticket");

    // Condition for creating the index_ticket table only if the table doesn't exist already.
    if (!indexTicketTableExists) {
      await queryInterface.createTable("index_ticket", {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false,
        },
        ticket_id: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        ticket_url: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        external_ticket_id: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        parent_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        parent_ticket_id: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        parent_ticket_url: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        summary: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        project_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        project_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        status: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        status_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        status_group_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        type_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        component_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        type_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        affected_version: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        affected_version_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        sprint_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        sprint_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        release_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        release_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        priority: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        priority_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        severity_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        severity_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        component: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        component_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        labels: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        acceptance_criteria: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        environment: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        build_number: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        test_step: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        actual_results: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        expected_results: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        reference_screenshots: {
          type: Sequelize.JSON,
          allowNull: true,
        },
        reported_by: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        reported_by_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        assigned_to: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        assigned_to_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        reviewer: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        reviewer_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        jira_created_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        eta: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        completed_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        story_points: {
          type: Sequelize.DECIMAL(10,2),
          allowNull: true,
        },
        estimated_hours: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        actual_hours: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        system_hours: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        tested_environment: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        tested_build: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        jira_status_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        status_changed_at: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        jira_host: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        trello_board_id: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        jira_ticket_url: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        trello_ticket_url: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        test_suite_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        delivery_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        updated_eta: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        applicable_devices: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        production_status: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        customer_delivery_date: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        customer_estimated_hours: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        user_impact: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        production_status_notes: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        initial_eta: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        project_ticket_type: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        jira_assignee: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        jira_assignee_name: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        incentive_points: {
          type: Sequelize.INTEGER,
          allowNull: true,
        },
        company_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
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
    // Defining whether the index_ticket table already exist or not.
    const indexTicketTableExists = await queryInterface.tableExists("index_ticket");

    // Condition for dropping the index_ticket table only if the table exist already.
    if (indexTicketTableExists) {
      await queryInterface.dropTable("index_ticket");
    };
  } catch (err) {
    console.log(err);
  };
};
