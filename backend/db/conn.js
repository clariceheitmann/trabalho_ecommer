const { Sequelize } = require('sequelize')

const db = new Sequelize('analog_dreams', 'root', 'senai',{
        host: 'localhost',
        dialect: 'mysql',
        port: 3306,
        logging: false
    }
)

module.exports = db