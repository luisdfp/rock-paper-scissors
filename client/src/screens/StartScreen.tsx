import React, {FormEvent, useContext, useMemo} from "react";
import {GameContext} from "../App";
import Form from "react-bootstrap/form"
import StyledButton from "../components/StyledButton";
import Col from "react-bootstrap/Col";

export default function StartScreen() {
  const {gameState, setPlayerName, changeScreenTo} = useContext(GameContext)
  const playerOne = gameState.players.one
  const playerTwo = gameState.players.two

  const startEnabled = useMemo(() => {
    return playerOne.name.length > 0 && playerTwo.name.length > 1
  }, [playerOne.name, playerTwo.name])

  const onStart = (e : FormEvent<HTMLElement>) => {
    e.preventDefault()
    if(startEnabled)
      changeScreenTo("match")
  }
  return (
      <div className="start-screen row d-flex justify-content-center">
        <Col xs={12} sm={8} lg={6}>
          <h2 className="font-weight-bold text-center mb-4">Rock 🗿, Paper🧾, Scissors✂</h2>
          <p className="text-center">Enter the players' names to start</p>
          <Form onSubmit={onStart}>
            <Form.Group>
              <Form.Row>
                <Col xs={4} lg={3} className="pt-1">
                  <Form.Label className="font-weight-bold">Player 1</Form.Label>
                </Col>
                <Col xs={8} lg={9}>
                  <Form.Control
                      value={playerOne.name}id="player-1-name" type="text" placeholder="Player 1"
                      onChange={e => setPlayerName("one", e.target.value)}/>
                </Col>
              </Form.Row>
            </Form.Group>
            <Form.Group>
              <Form.Row>
                <Col xs={4} lg={3} className="pt-1">
                  <Form.Label className="font-weight-bold">Player 2</Form.Label>
                </Col>
                <Col xs={8} lg={9}>
                  <Form.Control
                      value={playerTwo.name} id="player-2-name" type="text" placeholder="Player 2"
                      onChange={e => setPlayerName("two", e.target.value)} />
                </Col>
              </Form.Row>

            </Form.Group>
            <StyledButton disabled={!startEnabled}
                          type="submit"
                          onClick={onStart}>Start</StyledButton>
          </Form>
        </Col>
      </div>
  )
}