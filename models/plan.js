'use strict';
module.exports = (sequelize, DataTypes) => {
  const plan = sequelize.define('plan', {
    userId: DataTypes.INTEGER,
    eventId: DataTypes.INTEGER,
    restaurantId: DataTypes.INTEGER,
    date: DataTypes.STRING
  }, {});
  plan.associate = function(models) {
    // associations can be defined here
    models.plan.belongsTo(models.event);
    models.plan.belongsTo(models.restaurant);
    models.plan.belongsTo(models.user);
  };
  return plan;
};