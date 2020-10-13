var express = require('express');
var router = express.Router();
const Match = require('../models/Match')
/* GET home page. */
router.get('/matches', (req, res) => {
    Match.findAll()
        .then(matches => {
            res.status(200)
            res.set('Cache-Control', 'no-store')
            res.json(matches.map(match => ({
                id: match.id,
                rounds: match.rounds,
                players: {
                    one: {
                        name: match.playerOneName,
                        score: match.playerOneScore
                    },
                    two: {
                        name: match.playerTwoName,
                        score: match.playerTwoScore
                    },
                },
                timestamp: match.timestamp
            })))
        })
})

router.post('/match', (req, res) => {
    const {players, rounds} = req.body
    Match.create({
        playerOneName: players.one.name,
        playerOneScore: players.one.score,
        playerTwoName: players.two.name,
        playerTwoScore: players.two.score,
        rounds: rounds,
        timestamp: new Date()
    })
        .then(match => {
            res.status(200)
            res.json(match)
        })
})
module.exports = router;
