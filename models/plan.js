'use strict';
module.exports = (sequelize, DataTypes) => {
  const plan = sequelize.define('plan', {
    eventId: DataTypes.INTEGER,
    restaurantId: DataTypes.INTEGER,
    date: DataTypes.STRING
  }, {});
  plan.associate = function(models) {
    // associations can be defined here
    models.plan.belongsTo(models.event);
    models.plan.belongsTo(models.restaurant);
    models.plan.belongsToMany(models.user, {
      through: "user_plan"
    });
  };
  return plan;
};