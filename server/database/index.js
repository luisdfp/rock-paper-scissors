const Sequelize = require('sequelize')

const {DB_NAME, DB_USER, DB_PASS, DB_HOST, DB_PORT} = process.env

const db = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'mysql',
    define: {
        timestamps: false // true by default
    }
});

module.exports = db