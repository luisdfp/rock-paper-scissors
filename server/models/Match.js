const Sequelize = require('sequelize')

const db = require('../database')

const Match = db.define('match', {
    playerOneName: {
        type: Sequelize.STRING
    },
    playerOneScore: {
        type: Sequelize.INTEGER.UNSIGNED
    },
    playerTwoName: {
        type: Sequelize.STRING
    },
    playerTwoScore: {
        type: Sequelize.INTEGER.UNSIGNED
    },
    rounds: {
        type: Sequelize.INTEGER.UNSIGNED
    },
    timestamp: {
        type: Sequelize.DATE
    }
})
module.exports = Match