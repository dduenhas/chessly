import { useState, useCallback, useRef, useEffect } from 'react'
import { Chess } from 'chess.js'
import ChessBoard, { getMoveDests, getTurnColor } from '../components/ChessBoard'
import ptBR from '../i18n/pt-BR'

type Level = 'beginner' | 'easy' | 'medium'

function randomMove(chess: Chess): string {
  const moves = chess.moves()
  return moves[Math.floor(Math.random() * moves.length)]
}

function Jogar() {
  const chessRef = useRef(new Chess())
  const [fen, setFen] = useState(chessRef.current.fen())
  const [gameOver, setGameOver] = useState(false)
  const [result, setResult] = useState('')
  const [playing, setPlaying] = useState(false)
  const [level, setLevel] = useState<Level>('beginner')
  const [computerThinking, setComputerThinking] = useState(false)
  const [isPlayerWhite] = useState(true)

  const startGame = useCallback(() => {
    const chess = new Chess()
    chessRef.current = chess
    setFen(chess.fen())
    setGameOver(false)
    setResult('')
    setPlaying(true)
    setComputerThinking(false)
  }, [])

  const makeComputerMove = useCallback(() => {
    setComputerThinking(true)
    setTimeout(() => {
      const chess = chessRef.current
      if (chess.isGameOver()) {
        setComputerThinking(false)
        return
      }

      let move: string
      if (level === 'beginner') {
        move = randomMove(chess)
      } else if (level === 'easy') {
        const moves = chess.moves({ verbose: true })
        const captures = moves.filter((m) => m.flags.includes('c'))
        move = captures.length > 0 && Math.random() > 0.4
          ? captures[Math.floor(Math.random() * captures.length)].san
          : randomMove(chess)
      } else {
        const moves = chess.moves({ verbose: true })
        const checks = moves.filter((m) => m.san.includes('+'))
        const captures = moves.filter((m) => m.flags.includes('c'))
        if (checks.length > 0 && Math.random() > 0.5) {
          move = checks[Math.floor(Math.random() * checks.length)].san
        } else if (captures.length > 0 && Math.random() > 0.3) {
          move = captures[Math.floor(Math.random() * captures.length)].san
        } else {
          move = randomMove(chess)
        }
      }

      try {
        chess.move(move)
        setFen(chess.fen())

        if (chess.isGameOver()) {
          setGameOver(true)
          if (chess.isCheckmate()) {
            setResult(chess.turn() === 'w' ? ptBR.jogar.youWin : ptBR.jogar.computerWins)
          } else {
            setResult(ptBR.jogar.draw)
          }
        }
      } catch {}
      setComputerThinking(false)
    }, 600 + Math.random() * 400)
  }, [level])

  useEffect(() => {
    if (playing && !gameOver && chessRef.current.turn() === 'b') {
      makeComputerMove()
    }
  }, [playing, gameOver, fen])

  const handleMove = useCallback(
    (from: string, to: string) => {
      const chess = chessRef.current
      if (chess.turn() === 'b' || gameOver || computerThinking) return

      try {
        const move = chess.move({ from, to, promotion: 'q' })
        if (move) {
          setFen(chess.fen())

          if (chess.isGameOver()) {
            setGameOver(true)
            if (chess.isCheckmate()) {
              setResult(chess.turn() === 'w' ? ptBR.jogar.computerWins : ptBR.jogar.youWin)
            } else {
              setResult(ptBR.jogar.draw)
            }
          }
        }
      } catch {}
    },
    [gameOver, computerThinking]
  )

  const chess = chessRef.current
  const dests = getMoveDests(chess)
  const turnColor = getTurnColor(chess)
  const isPlayerTurn = turnColor === 'white'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{ptBR.jogar.title}</h1>
        <p className="text-gray-600">{ptBR.jogar.subtitle}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          {!playing ? (
            <div className="card flex flex-col gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{ptBR.jogar.selectLevel}</label>
                <div className="flex gap-3">
                  {(['beginner', 'easy', 'medium'] as Level[]).map((l) => (
                    <button
                      key={l}
                      onClick={() => setLevel(l)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        level === l
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {ptBR.jogar.levels[l]}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={startGame} className="btn-primary w-full text-lg">
                {ptBR.jogar.newGame}
              </button>
              <div className="bg-gray-50 border rounded-lg p-4">
                <div className="flex items-center justify-center text-6xl mb-2">🤖</div>
                <p className="text-center text-gray-600">{ptBR.jogar.waitingForGame}</p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <ChessBoard
                fen={fen}
                orientation="white"
                movable={{
                  dests: isPlayerTurn ? dests : new Map(),
                  color: 'white',
                }}
                onMove={handleMove}
              />
            </div>
          )}
        </div>

        <div className="w-full md:w-64 space-y-4">
          {playing && (
            <>
              <div className="card">
                <h3 className="font-bold text-lg mb-2">🎯 Status</h3>
                {gameOver ? (
                  <div className={`text-lg font-bold ${result === ptBR.jogar.youWin ? 'text-green-600' : 'text-red-600'}`}>
                    {result}
                  </div>
                ) : (
                  <div>
                    <p className={`font-semibold ${isPlayerTurn ? 'text-green-600' : 'text-gray-500'}`}>
                      {isPlayerTurn ? '▶ ' + ptBR.jogar.yourTurn : '⏳ ' + ptBR.jogar.computerThinking}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      {isPlayerTurn ? 'Faça seu lance no tabuleiro' : 'Aguarde o computador...'}
                    </p>
                  </div>
                )}
              </div>

              <div className="card">
                <h3 className="font-bold text-lg mb-2">🤖 Computador</h3>
                <p className="text-sm text-gray-600">Nível: <span className="font-semibold">{ptBR.jogar.levels[level]}</span></p>
              </div>

              {(gameOver || computerThinking) && (
                <button onClick={startGame} className="btn-primary w-full">
                  🔄 {ptBR.jogar.newGame}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Jogar
