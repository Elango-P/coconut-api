module.exports = (sequelize, DataTypes) => {
	const SchedulerJob = sequelize.define("scheduler_job", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		job_name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		interval: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		api_url: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		notes: {
			type: DataTypes.TEXT,
			allowNull: true
		},
		completed_at: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		started_at: {
			type: DataTypes.DATE,
			allowNull: true,
		},
		start_time: {
			type: DataTypes.TIME,
			allowNull: true,
		},
		company_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		to_email: {
			type: DataTypes.STRING,
			allowNull: true
		},
		to_slack: {
			type: DataTypes.STRING,
			allowNull: true
		},
		end_time: {
			type: DataTypes.TIME,
			allowNull: true,
		},
		type: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		day: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		month: {
			type: DataTypes.DECIMAL,
			allowNull: true,
		},
		week: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		date: {
			type: DataTypes.DECIMAL,
			allowNull: true,
		},
		start_date: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		end_date: {
			type: DataTypes.DATEONLY,
			allowNull: true
		},
		object_status: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		object_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		date_type: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
	}, {
		tableName: "scheduler_job",
		timestamps: true,
		createdAt: "createdAt",
		updatedAt: "updatedAt",
		deletedAt: "deletedAt",
		paranoid: true,
	});

	return SchedulerJob;
};
