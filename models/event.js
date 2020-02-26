'use strict';
module.exports = (sequelize, DataTypes) => {
  const event = sequelize.define('event', {
    title: DataTypes.STRING,
    location: DataTypes.STRING,
    date: DataTypes.STRING,
    time: DataTypes.INTEGER,
    eventbriteId: DataTypes.INTEGER
  }, {});
  event.associate = function(models) {
    // associations can be defined here
    models.event.hasMany(models.plan);
  };
  return event;
};