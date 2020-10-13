import React, {useEffect, useMemo, useState} from "react";
import Table from "react-bootstrap/Table";
import {getMatches} from "../api";
import Spinner from "react-bootstrap/Spinner";
import moment from "moment";

interface LeaderboardRecord {
  player: string,
  wins: number,
  losses: number
}

export default function LeaderboardScreen() {
  const [matches, setMatches] = useState<Match[]>([])
  const [isLoading, setLoading] = useState(false)
  const leaderboardRecords = useMemo<LeaderboardRecord[]>(() => {
    return getLeaderboardRecords(matches)
  }, [matches])

  async function fetchMatches() {
    setLoading(true)
    setMatches(await getMatches())
    setLoading(false)
  }

  useEffect( () => {
    fetchMatches()
  }, [])


  return (
      <div className="match-history text-white">
        {isLoading ? (
            <div className="text-center">
              <Spinner animation="border"/>
            </div>
        ) : (
            <>
              <h3 className="text-center mb-3">Leaderboards</h3>
              <Table responsive="sm" className="text-white mb-4">
                <thead>
                  <tr>
                    <th>Player</th>
                    <th>Wins</th>
                    <th>Losses</th>
                  </tr>
                </thead>
                <tbody>
                {leaderboardRecords.map(({player, wins, losses}) => (
                    <tr key={player}>
                      <td>{player}</td>
                      <td>{wins}</td>
                      <td>{losses}</td>
                    </tr>
                ))}
                </tbody>
              </Table>
              <h3 className="text-center mb-3">Match History</h3>
              <Table responsive="sm" className="text-white">
                <thead>
                <tr>
                  <th>ID</th>
                  <th>Player 1</th>
                  <th>Player 2</th>
                  <th>Rounds</th>
                  <th>Scores</th>
                  <th>Date</th>
                </tr>
                </thead>
                <tbody>
                {matches.map(({id, players, rounds, timestamp}) => (
                    <tr key={id}>
                      <td>{id}</td>
                      <td>{players.one.name}</td>
                      <td>{players.two.name}</td>
                      <td>{rounds}</td>
                      <td>{players.one.score} - {players.two.score}</td>
                      <td>{formatTimestamp(timestamp)}</td>
                    </tr>
                ))}
                </tbody>
              </Table>
            </>
        )}
      </div>
  )
}

function getLeaderboardRecords(matches : Match[]) : LeaderboardRecord[] {
  const map = new Map<string, LeaderboardRecord>()
  matches.forEach(match => {
    const winner = getMatchWinner(match)
    const loser = getMatchLoser(match)
    if(winner) {
      const record = map.get(winner.name)
      if (record) {
        record.wins = record.wins + 1
        map.set(winner.name, record)
      } else {
        map.set(winner.name, {
          player: winner.name,
          wins: 1,
          losses: 0
        })
      }
    }

    if(loser) {
      const record = map.get(loser.name)

      if (record) {
        record.losses = record.losses + 1
        map.set(loser.name, record)
      } else {
        map.set(loser.name, {
          player: loser.name,
          wins: 0,
          losses: 1
        })
      }
    }
  })

  return Array.from(map).map(([, record]) => record)
}

function getMatchWinner(match : Match) : Player & {score: number} | null {
  const players = match.players
  if(players.one.score > players.two.score)
    return players.one
  if (players.two.score > players.one.score)
    return players.two

  return null
}

function getMatchLoser(match : Match) : Player & {score: number} | null {
  const players = match.players
  if(players.one.score < players.two.score)
    return players.one
  if (players.two.score < players.one.score)
    return players.two

  return null
}

function formatTimestamp(timestamp : Date) {
  return moment(timestamp).format('DD/MM/YYYY HH:mm:ss')
}