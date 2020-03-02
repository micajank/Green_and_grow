'use strict';
module.exports = (sequelize, DataTypes) => {
  const event = sequelize.define('event', {
    userId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    location: DataTypes.STRING,
    state: DataTypes.STRING,
    date: DataTypes.STRING,
    time: DataTypes.STRING,
    eventbriteId: DataTypes.STRING
  }, {});
  event.associate = function(models) {
    // associations can be defined here
    models.event.hasMany(models.plan);
  };
  return event;
};