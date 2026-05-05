import { useEffect, useRef, useCallback } from 'react'
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
  const onMoveRef = useRef(onMove)
  onMoveRef.current = onMove

  const syncBoard = useCallback(
    (opts?: { fen?: string }) => {
      const cg = cgRef.current
      const chess = chessRef.current
      if (!cg) return

      if (opts?.fen) {
        try {
          chess.load(opts.fen)
        } catch {}
      }

      const dests = movable ? movable.dests : (!viewOnly ? toDests(chess) : new Map())
      const turnColor = movable ? movable.color : toColor(chess)

      cg.set({
        fen: chess.fen(),
        movable: viewOnly
          ? { free: false, dests: new Map(), color: turnColor }
          : {
              free: false,
              dests,
              color: turnColor,
              events: {
                after: (from: string, to: string) => {
                  const currentChess = chessRef.current
                  try {
                    const moveResult = currentChess.move({ from, to, promotion: 'q' })
                    if (moveResult) {
                      syncBoard()
                    }
                  } catch {}
                  onMoveRef.current?.(from, to)
                },
              },
            },
      } as any)
    },
    [movable, viewOnly]
  )

  useEffect(() => {
    if (!boardRef.current) return

    if (cgRef.current) {
      cgRef.current.destroy()
    }

    if (fen) {
      try {
        chessRef.current.load(fen)
      } catch {}
    }

    const chess = chessRef.current
    const dests = movable ? movable.dests : (!viewOnly ? toDests(chess) : new Map())
    const turnColor = movable ? movable.color : toColor(chess)

    cgRef.current = Chessground(boardRef.current, {
      fen: chess.fen(),
      orientation,
      viewOnly: viewOnly ?? false,
      coordinates: true,
      drawable: { enabled: false },
      movable: viewOnly
        ? { free: false, dests: new Map(), color: turnColor }
        : {
            free: false,
            dests,
            color: turnColor,
            events: {
              after: (from: string, to: string) => {
                const currentChess = chessRef.current
                try {
                  const moveResult = currentChess.move({ from, to, promotion: 'q' })
                  if (moveResult) {
                    syncBoard()
                  }
                } catch {}
                onMoveRef.current?.(from, to)
              },
            },
          },
    })

    return () => {
      cgRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    if (!cgRef.current) return
    if (fen) {
      try {
        chessRef.current.load(fen)
      } catch {}
    }
    syncBoard({ fen })
  }, [fen])

  useEffect(() => {
    if (!cgRef.current) return
    syncBoard()
  }, [viewOnly])

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
