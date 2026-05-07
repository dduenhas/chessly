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
  freeMove?: boolean
  onPieceSelect?: (square: string) => void
  selectableEnabled?: boolean
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

function ChessBoard({ fen, orientation = 'white', movable, onMove, viewOnly, freeMove, onPieceSelect, selectableEnabled }: ChessBoardProps) {
  const boardRef = useRef<HTMLDivElement>(null)
  const chessRef = useRef<Chess>(new Chess())
  const cgRef = useRef<ReturnType<typeof Chessground> | null>(null)
  const onMoveRef = useRef(onMove)
  onMoveRef.current = onMove
  const onPieceSelectRef = useRef(onPieceSelect)
  onPieceSelectRef.current = onPieceSelect
  const fenRef = useRef(fen)
  fenRef.current = fen

  const isExternalControl = !!movable

  const syncBoard = useCallback(
    () => {
      const cg = cgRef.current
      if (!cg) return

      if (freeMove) {
        cg.set({
          fen: fenRef.current || '8/8/8/8/8/8/8/8',
          selectable: { enabled: selectableEnabled ?? true },
        })
        return
      }

      const turnColor = toColor(chessRef.current)

      if (isExternalControl) {
        cg.set({
          fen: chessRef.current.fen(),
          turnColor,
          movable: viewOnly
            ? { free: false, dests: new Map(), color: movable!.color }
            : {
                free: false,
                dests: movable!.dests,
                color: movable!.color,
                events: {
                  after: (_from: string, _to: string) => {
                    onMoveRef.current?.(_from, _to)
                  },
                },
              },
        } as any)
      } else {
        const chess = chessRef.current
        const dests = viewOnly ? new Map() : toDests(chess)

        cg.set({
          fen: chess.fen(),
          turnColor,
          movable: viewOnly
            ? { free: false, dests: new Map(), color: turnColor }
            : {
                free: false,
                dests,
                color: turnColor,
                events: {
                  after: (from: string, to: string) => {
                    try {
                      const moveResult = chess.move({ from, to, promotion: 'q' })
                      if (moveResult) {
                        syncBoard()
                      }
                    } catch {}
                  },
                },
              },
        } as any)
      }
    },
    [isExternalControl, movable, viewOnly, freeMove, selectableEnabled]
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

    if (freeMove) {
      const initialConfig: any = {
        fen: fen || '8/8/8/8/8/8/8/8',
        orientation,
        coordinates: true,
        drawable: { enabled: false },
        selectable: { enabled: selectableEnabled ?? true },
        movable: {
          free: true,
          color: 'both' as any,
          events: {
            after: (_from: string, _to: string) => {
              onMoveRef.current?.(_from, _to)
            },
          },
        },
      }

      if (onPieceSelect) {
        initialConfig.events = {
          select: (key: string) => {
            onPieceSelectRef.current?.(key)
          },
        }
      }

      cgRef.current = Chessground(boardRef.current, initialConfig)

      return () => {
        cgRef.current?.destroy()
      }
    }

    const turnColor = toColor(chess)

    const initialConfig: any = {
      fen: chess.fen(),
      turnColor,
      orientation,
      viewOnly: viewOnly ?? false,
      coordinates: true,
      drawable: { enabled: false },
    }

    if (isExternalControl) {
      initialConfig.movable = viewOnly
        ? { free: false, dests: new Map(), color: movable!.color }
        : {
            free: false,
            dests: movable!.dests,
            color: movable!.color,
            events: {
              after: (from: string, to: string) => {
                onMoveRef.current?.(from, to)
              },
            },
          }
    } else {
      const dests = viewOnly ? new Map() : toDests(chess)
      initialConfig.movable = viewOnly
        ? { free: false, dests: new Map(), color: turnColor }
        : {
            free: false,
            dests,
            color: turnColor,
            events: {
              after: (from: string, to: string) => {
                try {
                  const moveResult = chess.move({ from, to, promotion: 'q' })
                  if (moveResult) {
                    syncBoard()
                  }
                } catch {}
              },
            },
          }
    }

    cgRef.current = Chessground(boardRef.current, initialConfig)

    return () => {
      cgRef.current?.destroy()
    }
  }, [])

  useEffect(() => {
    if (!cgRef.current) return
    if (freeMove) {
      cgRef.current.set({ fen: fen || '8/8/8/8/8/8/8/8' })
      return
    }
    if (fen) {
      try {
        chessRef.current.load(fen)
      } catch {}
    }
    syncBoard()
  }, [fen])

  useEffect(() => {
    if (!cgRef.current) return
    syncBoard()
  }, [viewOnly, freeMove, selectableEnabled])

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
