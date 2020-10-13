import React, {useContext} from "react";
import {GameContext} from "../App";
import Table from "react-bootstrap/table";

export default function Scoreboard(props: { results: RoundResult[] }) {
  const {gameState} = useContext(GameContext)
  const {players} = gameState
  const {results} = props
  return (
      <div className="scoreboard">
        <h3 className="text-center font-weight-bold mb-3">Scores</h3>
        <Table responsive className="text-white text-center">
          <thead>
            <tr>
              <th>Round</th>
              <th>Winner</th>
            </tr>
          </thead>
          <tbody>
          {results.map(({round, winner}) =>
              <tr>
                <td>{round}</td>
                <td>{winner ? players[winner].name : '(Draw)'}</td>
              </tr>
          )}
          </tbody>
        </Table>
      </div>
  )
}