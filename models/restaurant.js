'use strict';
module.exports = (sequelize, DataTypes) => {
  const restaurant = sequelize.define('restaurant', {
    userId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    location: DataTypes.STRING,
    zomatoId: DataTypes.INTEGER
  }, {});
  restaurant.associate = function(models) {
    // associations can be defined here
    models.restaurant.hasMany(models.plan);
  };
  return restaurant;
};