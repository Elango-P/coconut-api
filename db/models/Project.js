module.exports = (sequelize, DataTypes) => {
  const ProjectRelease = require("./ProjectRelease")(sequelize, DataTypes);
  const ProjectSprint = require("./ProjectSprint")(sequelize, DataTypes);
  const ProjectPriority = require("./ProjectPriority")(sequelize, DataTypes);
  const ProjectConfig = require("./ProjectConfig")(sequelize, DataTypes);
  const ProjectSeverity = require("./ProjectSeverity")(sequelize, DataTypes);
    const status = require("./status")(sequelize, DataTypes);

  const Project = sequelize.define(
    "Project",
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      code: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull:true,
      },
      user: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      last_ticket_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      sort: {
        type: DataTypes.DECIMAL,
        allowNull: true,
      },
      allow_manual_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      component: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      repository: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      jira_host: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      jira_project_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      jira_board_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      update_jira: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status_text: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      trello_board_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      trello_board_list_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      slack_webhook_key: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      jira_auth_type: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      company_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      last_ticket_number: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      tableName: "project",
      timestamps: true,
      paranoid: true,
      createdAt: "created_at",
      updatedAt: false,
      deletedAt: "deleted_at",
    }
  );
  Project.hasOne(ProjectRelease, {
    as: "projectRelease",
    foreignKey: "project_id",
  });
  Project.hasMany(ProjectRelease, {
    as: "projectReleases",
    foreignKey: "project_id",
  });
  Project.hasMany(ProjectSprint, {
    as: "projectSprints",
    foreignKey: "project_id",
  });
  Project.hasMany(ProjectPriority, {
    as: "projectPriority",
    foreignKey: "project_id",
  });
  Project.hasMany(ProjectSeverity, {
    as: "projectSeverity",
    foreignKey: "project_id",
  });
  Project.hasMany(ProjectConfig, {
    as: "projectConfig",
    foreignKey: "project_id",
  });
  Project.belongsTo(status, {
    as: "statusData",
    foreignKey: "status",
  });


  return Project;
};
