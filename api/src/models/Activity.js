const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
	sequelize.define('activity', {
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
		},
		difficulty: {
			type: DataTypes.INTEGER,
			validate: {
				min: 1,
				max: 5
			}
		},
		duration: {
			type: DataTypes.INTEGER,
			defaultValue: 0,
		},
		season: {
			type: DataTypes.ENUM(
				"summer",
				"autum",
				"winter",
				"spring",
			),
			defaultValue: 'summer',
		},
	});
};
