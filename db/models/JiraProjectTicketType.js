module.exports = (sequelize, DataTypes) => {
    const Project = require("./Project")(sequelize, DataTypes);
    const ProjectTicketType = require("./ProjectTicketType")(sequelize, DataTypes);

    const JiraProjectTicketType = sequelize.define("JiraProjectTicketType", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        project_id: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        project_ticket_type_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        jira_project_ticket_type_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        company_id : {
			type: DataTypes.INTEGER,  
			allowNull: true
		},
    }, {
        tableName: "jira_project_ticket_type",
        timestamps: true,
        paranoid: true,
        createdAt: "createdAt",
        updatedAt: "updatedAt",
        deletedAt: "deletedAt"
    });

    JiraProjectTicketType.belongsTo(Project, { as: "project", foreignKey: "project_id" });
    JiraProjectTicketType.belongsTo(ProjectTicketType, { as: "projectTicketType", foreignKey: "project_ticket_type_id" });

    return JiraProjectTicketType;
};