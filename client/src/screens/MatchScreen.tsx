import React, {createContext, Dispatch, SetStateAction, useContext, useEffect, useMemo, useRef, useState} from "react";
import {GameContext} from "../App";
import MovePicker from "../components/MovePicker";
import Scoreboard from "../components/Scoreboard";
import StyledButton from "../components/StyledButton";
import "./MatchScreen.css"
import {saveMatch} from "../api";

export interface MatchContext {
  round: number
  roundWinner: PlayerID | null,
  moveChoices: Record<PlayerID, string | null>,
  moves: Map<string, Move>,
  matchWinner: PlayerID | null,
  turns: PlayerID[],
  setChoices: Dispatch<SetStateAction<Record<PlayerID, string | null>>>,
  setTurns: Dispatch<SetStateAction<PlayerID[]>>,
  setRound: Dispatch<SetStateAction<number>>
  setRoundWinner: Dispatch<SetStateAction<"one" | "two" | null>>,
  setRoundWinnerChosen: Dispatch<SetStateAction<boolean>>,
  scores: Record<PlayerID, number>
}

export const MatchContext = createContext({} as MatchContext)

export default () => {
  const {gameState} = useContext(GameContext)
  const {players} = gameState
  const playerIDs = Object.keys(players) as PlayerID[]
  const roundsPerMatch = gameState.rules.roundsPerMatch

  const [moveChoices, setChoices] = useState<Record<PlayerID, string | null>>({
    one: null,
    two: null
  })
  const moves = useRef(new Map<string, Move>())
  gameState.rules.moves.forEach((move) => {
    moves.current.set(move.id, move)
  })

  const [turns, setTurns] = useState(playerIDs)
  const [roundResults, setRoundResults] = useState<RoundResult[]>([])
  const [roundWinner, setRoundWinner] = useState<PlayerID | null>(null)
  const [roundWinnerChosen, setRoundWinnerChosen] = useState(false)
  const [round, setRound] = useState(1)

  const scores = useMemo<Record<PlayerID, number>>(() => {
    const scores = {
      one: 0,
      two: 0,
    }
    roundResults.forEach((result) => {
      if (result.winner)
        scores[result.winner]++
    })
    return scores
  }, [roundResults]);

  const matchWinner = useMemo<PlayerID | null>(() => {
    return scores.one > scores.two ? "one" :
        scores.two > scores.one ? "two" : null
  }, [scores])

  function chooseRoundWinner() {
    const playerOneMoveID = moveChoices.one
    const playerTwoMoveID = moveChoices.two

    const playerOneMove = moves.current.get(playerOneMoveID!)!
    const playerTwoMove = moves.current.get(playerTwoMoveID!)!

    if (playerOneMove.kills === playerTwoMove.id)
      setRoundWinner("one")
    else if (playerTwoMove.kills === playerOneMove.id)
      setRoundWinner("two")
    else
      setRoundWinner(null)
  }

  function updateRoundResults() {
    roundResults.push({
      round: round,
      winner: roundWinner
    })
    setRoundResults([...roundResults])
  }

  useEffect(() => {
    if (!roundWinnerChosen && moveChoices.one && moveChoices.two) {
      chooseRoundWinner()
      setRoundWinnerChosen(true)
    }
  }, [roundWinnerChosen, moveChoices])

  useEffect(() => {
    if (roundWinnerChosen) {
      updateRoundResults()
    }
  }, [roundWinner, roundWinnerChosen])

  return (
      <MatchContext.Provider value={{
        round,
        roundWinner,
        moveChoices,
        moves: moves.current,
        matchWinner,
        turns,
        setChoices,
        setTurns,
        setRound,
        setRoundWinner,
        setRoundWinnerChosen,
        scores
      }}>
        <div className="match-screen row d-flex justify-content-center">
          <div className="current-screen col-4">
            {
              round <= roundsPerMatch ?
                  (
                    <div className="current-round">
                      <h3 className="text-center font-weight-bold mb-3">
                        Round {round} / {roundsPerMatch}
                      </h3>
                      <CurrentRound/>
                    </div>
                  ) :
                    <MatchResult/>
            }
          </div>
          <div className="col-4">
            <Scoreboard results={roundResults}/>
          </div>
        </div>
      </MatchContext.Provider>
  )
}

function CurrentRound() {
  const {turns, round, moveChoices, setChoices, setTurns, setRoundWinnerChosen, setRound, setRoundWinner} = useContext(MatchContext)
  const {gameState} = useContext(GameContext)
  const {roundsPerMatch} = gameState.rules
  const {players} = gameState
  const playerIDs = Object.keys(players) as PlayerID[]

  const playerPicked = (playerID: PlayerID, moveId: string) => {
    moveChoices[playerID] = moveId
    setChoices({...moveChoices})
    turns.shift()
    setTurns([...turns])
  }

  const nextRound = () => {
    setTurns(playerIDs)
    setRound(round <= roundsPerMatch ? (round + 1) : 1)
    setRoundWinnerChosen(false)

    playerIDs.forEach(playerID => {
      moveChoices[playerID] = null
    })
    setChoices({...moveChoices})
    setRoundWinner(null)
  }

  if (turns.length > 0) {
    const currentPlayerID = turns[0]
    return (
        <div className="current-round">
          <div className="pb-2 text-center">
            It's <span className="font-weight-bold">{players[currentPlayerID].name}</span>'s turn.
          </div>
          <MovePicker moves={gameState.rules.moves} onPick={(moveId) => {
            playerPicked(currentPlayerID, moveId)
          }}/>
        </div>
    )
  } else {
    return (
        <div className="round-summary">
          <RoundSummary/>
          <StyledButton onClick={nextRound}>
            {round >= roundsPerMatch ?
                "Finish" :
                "Next round"
            }
          </StyledButton>
        </div>
    )
  }
}

function RoundSummary() {
  const {roundWinner, moveChoices, moves, round} = useContext(MatchContext)
  const {gameState} = useContext(GameContext)
  const {players} = gameState
  const playerOneMove = moves.get(moveChoices.one!)!
  const playerTwoMove = moves.get(moveChoices.two!)!
  return (
    <div className="summary">
      <div className="text-center">
        {roundWinner ?
            <>🎉 <span className="font-weight-bold">{players[roundWinner].name}</span> wins round #{round}. 🎉</>:
            `DRAW`
        }
      </div>
      <div className="font-weight-bold my-3 text-center">Moves:</div>
      <div className="moves">
        <div className="move text-center">
          {players.one.name} -> {playerOneMove.name}
        </div>
        <div className="move text-center">
          {players.two.name} -> {playerTwoMove.name}
        </div>
      </div>

    </div>
  )
}

function MatchResult() {
  const {gameState, changeScreenTo} = useContext(GameContext)
  const {matchWinner, scores} = useContext(MatchContext)
  const {players} = gameState

  async function onFinish() {
    try {
      await saveMatch({
        players: {
          one: {
            name: players.one.name,
            score: scores.one
          },
          two: {
            name: players.two.name,
            score: scores.two
          }
        },
        rounds: gameState.rules.roundsPerMatch
      })
      changeScreenTo("start")
    } catch (e) {
      console.log(e)
    }
  }

  const PlayAgainButton = () =>
      <StyledButton onClick={onFinish}>Play again</StyledButton>

  if (matchWinner) {
    const winner = players[matchWinner].name
    return (
        <div className="match-result winner text-center">
          <h4 className="font-weight-bold mt-2">
            🏆 We have a WINNER! 🏆
          </h4>
          <p className="mt-5">{`${winner} is the new EMPEROR!`} 👑</p>
          <PlayAgainButton/>
        </div>
    )
  } else {
    return (
        <div className="match-result draw text-center">
          <h4 className="font-weight-bold mt-2">
            ⚖ DRAW ⚖
          </h4>
          <p className="mt-5">Neither of the players won... 🤔</p>
          <PlayAgainButton/>
        </div>
    )
  }
}