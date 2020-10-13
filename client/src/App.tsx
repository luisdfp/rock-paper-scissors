import React, {useState} from 'react';
import StartScreen from "./screens/StartScreen";
import MatchScreen from "./screens/MatchScreen";
import LeaderboardScreen from "./screens/LeaderboardScreen";
import config from "./game-config"
import './App.css';
import Navigation from "./components/Navigation";

const initialGameState: GameState = {
  players: {
    one: {
      name: '',
    },
    two: {
      name: '',
    }
  },
  currentScreen: "start",
  rules: {
    moves: config.moves,
    roundsPerMatch: config.roundsPerMatch
  }
}

export const GameContext = React.createContext({} as IGameContext)

function App() {
  const [gameState, setGameState] = useState(initialGameState)

  const setPlayerName = (player: PlayerID, name: string) =>
    setGameState(state => {
      state.players[player].name = name
      return { ...state }
    })

  const changeScreenTo = (screen: GameScreen) =>
    setGameState((state) => {
      state.currentScreen = screen
      return { ...state }
    })

  let screen;
  switch (gameState.currentScreen) {
    case "start":
      screen = <StartScreen/>
      break
    case "match":
      screen = <MatchScreen/>
      break
    case "leaderboards":
      screen = <LeaderboardScreen/>
      break
  }

  return (
      <div className="app d-flex justify-content-center align-items-center">
        <GameContext.Provider value={{
          gameState,
          setPlayerName,
          changeScreenTo
        }}>
          <Navigation/>
          <div className="container">
            {screen}
          </div>
        </GameContext.Provider>
      </div>
  );
}

export default App;
