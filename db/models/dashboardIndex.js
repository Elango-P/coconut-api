module.exports = (sequelize, DataTypes) =>
	sequelize.define("dashboardIndex", {
		user_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true,
		},
		user_name: {
			type: DataTypes.STRING,
			allowNull: true
		},
		user_status: {
			type: DataTypes.STRING,
			allowNull: true
		},
		pending_tickets: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		pending_estimated_hours: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		pending_story_points: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		todays_tickets: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		todays_estimated_hours: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		todays_story_points: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		open_tickets: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		open_estimated_hours: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		open_story_points: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		reopen_tickets: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		reopen_estimated_hours: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		reopen_story_points: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		hold_tickets: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		hold_estimated_hours: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		hold_story_points: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		inprogress_tickets: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		inprogress_estimated_hours: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		inprogress_story_points: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		review_tickets: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		review_estimated_hours: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		review_story_points: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		completed_tickets: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		completed_estimated_hours: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		completed_story_points: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		myreview_tickets: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		myreview_estimated_hours: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		myreview_story_points: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		new_tickets: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		new_estimated_hours: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		new_story_points: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		future_tickets: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		future_estimated_hours: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		future_story_points: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		final_review_tickets: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		final_review_estimated_hours: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		final_review_story_points: {
			type: DataTypes.DECIMAL,
			allowNull: true,
			defaultValue: 0.00
		},
		profile_status: {
			type: DataTypes.STRING,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},
	}, {
		tableName: "dashboard_index",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: false
	});
