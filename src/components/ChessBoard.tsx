import { useEffect, useRef } from 'react'
import { Chessground } from 'chessground'
import { Chess } from 'chess.js'
import 'chessground/assets/chessground.base.css'
import 'chessground/assets/chessground.brown.css'
import 'chessground/assets/chessground.cburnett.css'

interface ChessBoardProps {
  fen?: string
  orientation?: 'white' | 'black'
  movable?: { dests: Map<string, string[]>; color: 'white' | 'black' }
  onMove?: (from: string, to: string) => void
  viewOnly?: boolean
}

type Key = string

function toDests(chess: Chess): Map<Key, Key[]> {
  const dests = new Map<Key, Key[]>()
  const moves = chess.moves({ verbose: true })
  for (const move of moves) {
    const from = move.from as Key
    const to = move.to as Key
    if (!dests.has(from)) {
      dests.set(from, [])
    }
    dests.get(from)!.push(to)
  }
  return dests
}

function toColor(chess: Chess): 'white' | 'black' {
  return chess.turn() === 'w' ? 'white' : 'black'
}

function ChessBoard({ fen, orientation = 'white', movable, onMove, viewOnly }: ChessBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null)
  const chessRef = useRef<Chess>(new Chess())
  const cgRef = useRef<ReturnType<typeof Chessground> | null>(null)

  useEffect(() => {
    if (!boardRef.current) return

    const chess = chessRef.current
    if (fen) {
      try {
        chess.load(fen)
      } catch {}
    }

    const dests = movable ? movable.dests : (!viewOnly ? toDests(chess) : new Map())
    const turnColor = movable ? movable.color : toColor(chess)

    const config: any = {
      fen: chess.fen(),
      orientation,
      viewOnly: viewOnly ?? false,
      coordinates: true,
      resizable: true,
      drawable: { enabled: false },
      movable: {
        free: false,
        dests,
        color: turnColor,
        events: {
          after: (from: string, to: string) => {
            onMove?.(from, to)
          },
        },
      },
    }

    if (cgRef.current) {
      cgRef.current.destroy()
    }

    cgRef.current = Chessground(boardRef.current, config)

    return () => {
      cgRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    if (!cgRef.current) return
    const chess = chessRef.current

    if (fen) {
      try {
        chess.load(fen)
      } catch {}
    }

    const dests = movable ? movable.dests : (!viewOnly ? toDests(chess) : new Map())
    const turnColor = movable ? movable.color : toColor(chess)

    cgRef.current.set({
      fen: chess.fen(),
      movable: viewOnly
        ? { free: false, dests: new Map(), color: turnColor }
        : {
            free: false,
            dests,
            color: turnColor,
            events: {
              after: (from: string, to: string) => {
                onMove?.(from, to)
              },
            },
          },
    } as any)
  }, [fen, viewOnly])

  return (
    <div
      ref={boardRef}
      className="w-full max-w-[500px] aspect-square mx-auto"
      style={{ maxHeight: '80vh' }}
    />
  )
}

export function createChess() {
  return new Chess()
}

export function getMoveDests(chess: Chess): Map<string, string[]> {
  return toDests(chess)
}

export function getTurnColor(chess: Chess): 'white' | 'black' {
  return toColor(chess)
}

export default ChessBoard
