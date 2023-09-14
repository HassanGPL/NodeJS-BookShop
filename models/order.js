const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../helpers/databases');

const Order = sequelize.define('order', {
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    }
});

module.exports = Order;