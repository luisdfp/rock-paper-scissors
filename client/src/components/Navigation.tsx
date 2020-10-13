import Nav from "react-bootstrap/Nav";
import React, {useContext} from "react";
import {GameContext} from "../App";

export default function Navigation() {
  const {changeScreenTo, gameState} = useContext(GameContext)
  const {currentScreen} = gameState
  const selectedStyle = 'btn-light'
  const defaultStyle = 'btn-primary'

  if(currentScreen === "match")
    return <></>

  return (
      <Nav variant="pills" className="game-navigation mb-4">
        <Nav.Item>
          <Nav.Link as="button"
                    disabled={currentScreen === "start"}
                    className={"mr-3 p-1 font-weight-bold " + (currentScreen === "start" ? selectedStyle : defaultStyle)}
                    onClick={() => changeScreenTo("start")}>
            New Game
          </Nav.Link>
        </Nav.Item>

        <Nav.Item>
          <Nav.Link as="button"
                    disabled={currentScreen === "leaderboards"}
                    className={"p-1 font-weight-bold " + (currentScreen === "leaderboards" ? selectedStyle : defaultStyle)}
                    onClick={() => changeScreenTo("leaderboards")}>
            Leaderboards
          </Nav.Link>
        </Nav.Item>
      </Nav>
  )
}