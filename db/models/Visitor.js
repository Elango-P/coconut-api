module.exports = (sequelize, DataTypes) => {
	const media = require("./Media")(sequelize, DataTypes);
	const Tag = require("./Tag")(sequelize, DataTypes);


	const Visitor = sequelize.define("visitor", {
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
		type: {
			type: DataTypes.INTEGER,
			allowNull:false,
		  },
		  position: {
			type: DataTypes.STRING,
			allowNull: true
		},
		phone: {
			type: DataTypes.STRING,
			allowNull: true
		},
		purpose: {
			type: DataTypes.STRING,
			allowNull: true
		},
		title: {
			type: DataTypes.STRING,
			allowNull: true
		},
		notes: {
			type: DataTypes.STRING,
			allowNull: true
		},
		media_id: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		person_to_meet: {
			type: DataTypes.INTEGER,
			allowNull: true,
		},
		company_id: {
			type: DataTypes.INTEGER,
			allowNull: false
		},


	}, {
		tableName: "visitor",
		timestamps: true,
		createdAt: "created_at",
		updatedAt: false,
		deletedAt: "deleted_at",
		paranoid: true
	});
	Visitor.belongsTo(media, {
        as: "media",
        foreignKey: "media_id",
    });
	Visitor.belongsTo(Tag, {
        as: "tagDetails",
        foreignKey: "type",
    });
	  
	return Visitor
}