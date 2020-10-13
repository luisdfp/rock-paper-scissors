interface GameState {
  players: Record<PlayerID, Player>,
  currentScreen: GameScreen,
  rules: {
    moves: Move[]
    roundsPerMatch: number
  }
}

type PlayerID = 'one' | 'two'

interface Player {
  name: string,
}

type GameScreen = "start" | "match" | "leaderboards"

interface IGameContext {
  gameState: GameState,
  setPlayerName: (player: PlayerID, name: string) => void,
  changeScreenTo: (screen: GameScreen) => void
}

interface Move {
  id: string
  name: string,
  kills: string
}

interface RoundResult {
  round: number,
  winner: PlayerID | null
}

interface Match {
  id: string | number,
  timestamp: Date
  players: Record<PlayerID, Player & {score: number}>,
  rounds: number
}