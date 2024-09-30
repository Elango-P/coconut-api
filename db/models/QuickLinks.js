module.exports = (sequelize, DataTypes) =>
	sequelize.define("QuickLinks", {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false
		},
		role: {
			type: DataTypes.INTEGER,
			allowNull: false
		},
		type: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		is_main_url: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 0
		},
		show_current_user: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		status_id: {
			type: DataTypes.STRING,
			allowNull: true
		},
		group_id: {
			type: DataTypes.STRING,
			allowNull: false
		},
		ticket_type: {
			type: DataTypes.STRING,
			allowNull: false
		},
		excluded_user: {
			type: DataTypes.STRING,
			allowNull: false
		},
		project_id: {
			type: DataTypes.STRING,
			allowNull: false
		},
		release_id: {
			type: DataTypes.STRING,
			allowNull: false
		},
		sort: {
			type: DataTypes.DECIMAL,
			allowNull: false,
			defaultValue: 0.00
		},
		status: {
			type: DataTypes.INTEGER,
			allowNull: false,
			defaultValue: 1
		},
		url: {
			type: DataTypes.STRING,
			allowNull: true
		},
		company_id : {
			type: DataTypes.INTEGER,  
			allowNull: false
		},

	}, {
		tableName: "quick_links",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: "updated_at",
		deletedAt: false
	});
