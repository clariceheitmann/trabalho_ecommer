const { Sequelize } = require('sequelize')

const db = new Sequelize('ecommer_musica', 'root', 'senai',{
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
})

module.exports = db