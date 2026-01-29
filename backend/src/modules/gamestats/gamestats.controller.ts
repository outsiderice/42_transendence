

interface Game {
  id?: number
  player1_id: number
  player2_id: number
  winner_id: number
  player1_score?: number
  player2_score?: number
}

interface GameStats {
  wins: number
  losses: number
  winRate: number
  pointsFor: number
  pointsAgainst: number
  pointsDiff: number
}

export default function calculateGameStats(
  userId: number,
  games: Game[]
): GameStats {
  let wins = 0
  let losses = 0
  let pointsFor = 0
  let pointsAgainst = 0

  for (const game of games) {
    const isPlayer1 = game.player1_id === userId

    // Victorias / derrotas
    if (game.winner_id === userId) {
      wins++
    } else {
      losses++
    }

    // Puntos a favor / en contra
    if (isPlayer1) {
      pointsFor += game.player1_score ?? 0
      pointsAgainst += game.player2_score ?? 0
    } else {
      pointsFor += game.player2_score ?? 0
      pointsAgainst += game.player1_score ?? 0
    }
  }

  const totalGames = wins + losses
  const winRate =
    totalGames > 0 ? Number(((wins / totalGames) * 100).toFixed(2)) : 0
  console.log('Calculated Game Stats:', { wins, losses, winRate, pointsFor, pointsAgainst })

  return {
    wins,
    losses,
    winRate,
    pointsFor,
    pointsAgainst,
    pointsDiff: pointsFor - pointsAgainst
  }
}
