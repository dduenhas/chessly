import { useState, useCallback, useMemo, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Chess } from 'chess.js'
import ptBR from '../i18n/pt-BR'
import ChessBoard from '../components/ChessBoard'

type PieceColor = 'w' | 'b'
type PieceType = 'k' | 'q' | 'r' | 'b' | 'n' | 'p'
type ToolMode = 'place' | 'x-mark' | 'arrow-straight' | 'arrow-curved' | 'eraser'

interface PieceOnBoard {
  type: string
  color: PieceColor
}

interface SandboxShape {
  id: string
  type: 'x' | 'arrow-straight' | 'arrow-curved'
  from: string
  to?: string
  color: string
}

const FILES = 'abcdefgh'
const BOARD_SIZE = 8
const PIECE_SYMBOLS: Record<PieceColor, Record<string, string>> = {
  w: { k: '♔', q: '♕', r: '♖', b: '♗', n: '♘', p: '♙' },
  b: { k: '♚', q: '♛', r: '♜', b: '♝', n: '♞', p: '♟' },
}
const PIECE_ORDER: PieceType[] = ['k', 'q', 'r', 'b', 'n', 'p']
const PIECE_LABELS: Record<string, string> = {
  k: 'Rei', q: 'Dama', r: 'Torre', b: 'Bispo', n: 'Cavalo', p: 'Peão',
}
const PIECE_MAX: Record<string, number> = { k: 1, q: 1, r: 2, b: 2, n: 2, p: 8 }

const DEFAULT_SQUARES: Record<PieceColor, Record<string, string[]>> = {
  w: {
    k: ['e1'],
    q: ['d1'],
    r: ['a1', 'h1'],
    b: ['c1', 'f1'],
    n: ['b1', 'g1'],
    p: ['a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2'],
  },
  b: {
    k: ['e8'],
    q: ['d8'],
    r: ['a8', 'h8'],
    b: ['c8', 'f8'],
    n: ['b8', 'g8'],
    p: ['a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7'],
  },
}

const PIECE_MOVE_DESC: Record<string, string> = {
  k: 'Move 1 casa em qualquer direção. Nunca pode ir para uma casa atacada.',
  q: 'Move qualquer número de casas em linha reta ou diagonal.',
  r: 'Move qualquer número de casas na horizontal ou vertical.',
  b: 'Move qualquer número de casas na diagonal.',
  n: 'Move em "L": 2 casas + 1 perpendicular. O único que pula peças.',
  p: 'Avança 1 casa (ou 2 no primeiro lance). Captura na diagonal.',
}

function getAutoPlacementSquare(type: string, color: PieceColor, placedPieces: Map<string, PieceOnBoard>): string | null {
  const squares = DEFAULT_SQUARES[color][type] ?? []
  return squares.find((sq) => !placedPieces.has(sq)) ?? null
}

function countPiecesOnBoard(pieces: Map<string, PieceOnBoard>, type: string, color: PieceColor): number {
  let c = 0
  pieces.forEach((p) => { if (p.type === type && p.color === color) c++ })
  return c
}

function piecesToFen(pieces: Map<string, PieceOnBoard>): string {
  const board: (string | null)[][] = Array.from({ length: 8 }, () => Array(8).fill(null))
  pieces.forEach((piece, square) => {
    const fi = FILES.indexOf(square[0])
    const rn = parseInt(square[1])
    const row = 8 - rn
    if (row >= 0 && row < 8 && fi >= 0 && fi < 8) {
      board[row][fi] = piece.color === 'w' ? piece.type.toUpperCase() : piece.type.toLowerCase()
    }
  })
  const ranks: string[] = []
  for (let r = 0; r < 8; r++) {
    let rank = ''; let empty = 0
    for (let f = 0; f < 8; f++) {
      if (board[r][f]) {
        if (empty > 0) { rank += String(empty); empty = 0 }
        rank += board[r][f]
      } else { empty++ }
    }
    if (empty > 0) rank += String(empty)
    ranks.push(rank)
  }
  return ranks.join('/')
}

function getMoveDests(fen: string, square: string, pieceColor: PieceColor): string[] {
  try {
    const fullFen = `${fen} ${pieceColor} - - 0 1`
    const chess = new Chess(fullFen)
    const moves = chess.moves({ square: square as any, verbose: true })
    return (moves as any[]).map((m: any) => m.to)
  } catch { return [] }
}

function squareCenter(sq: string, pxSize: number): { x: number; y: number } {
  const sz = pxSize / BOARD_SIZE
  const f = FILES.indexOf(sq[0])
  const r = BOARD_SIZE - parseInt(sq[1])
  return { x: f * sz + sz / 2, y: r * sz + sz / 2 }
}

function ArrowHead({ cx, cy, angle, size, color }: { cx: number; cy: number; angle: number; size: number; color: string }) {
  const p1x = cx - size * Math.cos(angle - Math.PI / 6)
  const p1y = cy - size * Math.sin(angle - Math.PI / 6)
  const p2x = cx - size * Math.cos(angle + Math.PI / 6)
  const p2y = cy - size * Math.sin(angle + Math.PI / 6)
  return <polygon points={`${cx},${cy} ${p1x},${p1y} ${p2x},${p2y}`} fill={color} strokeLinejoin="round" />
}

function squareFromPoint(px: number, py: number, boardPx: number): string | null {
  const sz = boardPx / BOARD_SIZE
  const col = Math.floor(px / sz)
  const row = Math.floor(py / sz)
  if (col < 0 || col >= BOARD_SIZE || row < 0 || row >= BOARD_SIZE) return null
  return FILES[col] + String(BOARD_SIZE - row)
}

function Sandbox() {
  const [placedPieces, setPlacedPieces] = useState<Map<string, PieceOnBoard>>(new Map())
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [activeTool, setActiveTool] = useState<ToolMode>('place')
  const [shapes, setShapes] = useState<SandboxShape[]>([])
  const [drawingStart, setDrawingStart] = useState<string | null>(null)
  const [drawingCurrent, setDrawingCurrent] = useState<string | null>(null)
  const [pieceOpacities, setPieceOpacities] = useState<Map<string, number>>(new Map())
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [boardSize, setBoardSize] = useState(0)
  const shapeIdRef = useRef(0)
  const boardWrapperRef = useRef<HTMLDivElement>(null)

  const fen = useMemo(() => piecesToFen(placedPieces) || '8/8/8/8/8/8/8/8', [placedPieces])

  useEffect(() => {
    const el = boardWrapperRef.current
    if (!el) return
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) setBoardSize(entry.contentRect.width)
    })
    observer.observe(el)
    setBoardSize(el.clientWidth)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const wrapper = boardWrapperRef.current
    if (!wrapper) return
    let raf1: number, raf2: number
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        const pieces = wrapper.querySelectorAll('piece')
        pieces.forEach((el) => {
          const pieceEl = el as HTMLElement
          const transform = pieceEl.style.transform || ''
          const match = transform.match(/translate\(([\d.]+)%,\s*([\d.]+)%\)/)
          if (!match) { pieceEl.style.opacity = ''; return }
          const col = Math.round(parseFloat(match[1]) / 12.5)
          const row = Math.round(parseFloat(match[2]) / 12.5)
          if (col < 0 || col >= 8 || row < 0 || row >= 8) { pieceEl.style.opacity = ''; return }
          const sq = FILES[col] + String(8 - row)
          if (pieceOpacities.has(sq)) {
            pieceEl.style.opacity = String(pieceOpacities.get(sq))
            pieceEl.style.transition = 'opacity 0.2s ease'
          } else {
            pieceEl.style.opacity = ''
            pieceEl.style.transition = ''
          }
        })
      })
    })
    return () => { cancelAnimationFrame(raf1); cancelAnimationFrame(raf2) }
  }, [fen, pieceOpacities])

  const handleBoardMove = useCallback((from: string, to: string) => {
    setPlacedPieces((prev) => {
      const next = new Map(prev)
      const piece = next.get(from)
      if (!piece) return prev
      next.delete(from)
      next.set(to, piece)
      return next
    })
    setSelectedSquare((prev) => (prev === from ? to : prev))
    setShapes((prev) => prev.map((s) => {
      if (s.from === from) return { ...s, from: to }
      if (s.to === from) return { ...s, to }
      return s
    }))
  }, [])

  const handlePieceSelect = useCallback((square: string) => {
    if (activeTool !== 'place') return
    setSelectedSquare((prev) => (prev === square ? null : square))
  }, [activeTool])

  const moveDestsSquares = useMemo(() => {
    if (!selectedSquare) return []
    const piece = placedPieces.get(selectedSquare)
    if (!piece) return []
    return getMoveDests(fen, selectedSquare, piece.color)
  }, [fen, selectedSquare, placedPieces])

  const selectedPiece = selectedSquare ? placedPieces.get(selectedSquare) : null

  const getSqFromEvent = useCallback((e: React.MouseEvent): string | null => {
    const rect = boardWrapperRef.current?.getBoundingClientRect()
    if (!rect || !boardSize) return null
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    return squareFromPoint(x, y, boardSize)
  }, [boardSize])

  const handleSvgMouseDown = useCallback((e: React.MouseEvent) => {
    const drawing = activeTool === 'arrow-straight' || activeTool === 'arrow-curved'
    if (!drawing) return
    const sq = getSqFromEvent(e)
    if (sq) setDrawingStart(sq)
  }, [activeTool, getSqFromEvent])

  const handleSvgMouseMove = useCallback((e: React.MouseEvent) => {
    if (drawingStart === null) return
    const sq = getSqFromEvent(e)
    if (sq) setDrawingCurrent(sq)
  }, [drawingStart, getSqFromEvent])

  const handleSvgMouseUp = useCallback(() => {
    if (drawingStart && drawingCurrent && drawingStart !== drawingCurrent) {
      const type = activeTool === 'arrow-curved' ? 'arrow-curved' : 'arrow-straight'
      const color = type === 'arrow-curved' ? '#f59e0b' : '#3b82f6'
      setShapes((prev) => [...prev, { id: `arrow-${shapeIdRef.current++}`, type, from: drawingStart, to: drawingCurrent, color }])
    }
    setDrawingStart(null)
    setDrawingCurrent(null)
  }, [drawingStart, drawingCurrent, activeTool])

  const handleSvgClick = useCallback((e: React.MouseEvent) => {
    const sq = getSqFromEvent(e)
    if (!sq) return

    if (activeTool === 'x-mark') {
      setShapes((prev) => {
        const idx = prev.findIndex((s) => s.type === 'x' && s.from === sq)
        if (idx >= 0) return prev.filter((_, i) => i !== idx)
        return [...prev, { id: `x-${shapeIdRef.current++}`, type: 'x', from: sq, color: '#ef4444' }]
      })
      return
    }

    if (activeTool === 'eraser') {
      setShapes((prev) => prev.filter((s) => s.from !== sq && s.to !== sq))
      setPlacedPieces((prev) => {
        if (!prev.has(sq)) return prev
        const next = new Map(prev)
        next.delete(sq)
        return next
      })
      if (selectedSquare === sq) setSelectedSquare(null)
      setPieceOpacities((prev) => {
        if (!prev.has(sq)) return prev
        const next = new Map(prev)
        next.delete(sq)
        return next
      })
      return
    }
  }, [activeTool, placedPieces, selectedSquare, getSqFromEvent])

  const handleClearAll = useCallback(() => {
    setPlacedPieces(new Map())
    setShapes([])
    setSelectedSquare(null)
    setPieceOpacities(new Map())
    setShowClearConfirm(false)
    shapeIdRef.current = 0
  }, [])

  const handleOpacityChange = useCallback((value: number) => {
    if (!selectedSquare) return
    setPieceOpacities((prev) => {
      const next = new Map(prev)
      if (value >= 1) next.delete(selectedSquare)
      else next.set(selectedSquare, value)
      return next
    })
  }, [selectedSquare])

  const handleHalfTransparent = useCallback(() => {
    if (!selectedSquare) return
    setPieceOpacities((prev) => {
      const next = new Map(prev)
      if (next.has(selectedSquare)) next.delete(selectedSquare)
      else next.set(selectedSquare, 0.5)
      return next
    })
  }, [selectedSquare])

  const handleRemoveSelected = useCallback(() => {
    if (!selectedSquare) return
    setPlacedPieces((prev) => {
      const next = new Map(prev)
      next.delete(selectedSquare)
      return next
    })
    setShapes((prev) => prev.filter((s) => s.from !== selectedSquare && s.to !== selectedSquare))
    setPieceOpacities((prev) => {
      const next = new Map(prev)
      next.delete(selectedSquare!)
      return next
    })
    setSelectedSquare(null)
  }, [selectedSquare])

  const isDrawing = activeTool === 'arrow-straight' || activeTool === 'arrow-curved'
  const svgActive = isDrawing || activeTool === 'x-mark' || activeTool === 'eraser'

  const drawingArrow = drawingStart && drawingCurrent && drawingStart !== drawingCurrent
    ? { from: drawingStart, to: drawingCurrent }
    : null

  const toolButtons: { tool: ToolMode; icon: string; label: string }[] = [
    { tool: 'place', icon: '♟', label: ptBR.sandbox.tools.place },
    { tool: 'x-mark', icon: '✕', label: ptBR.sandbox.tools.xMark },
    { tool: 'arrow-straight', icon: '→', label: ptBR.sandbox.tools.arrowStraight },
    { tool: 'arrow-curved', icon: '↪', label: ptBR.sandbox.tools.arrowCurved },
    { tool: 'eraser', icon: '⌫', label: ptBR.sandbox.tools.eraser },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="mb-4">
        <Link to="/" className="text-blue-600 hover:text-blue-800 text-sm">{ptBR.sandbox.backToAdmin}</Link>
      </div>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1">{ptBR.sandbox.title}</h1>
        <p className="text-gray-600">{ptBR.sandbox.subtitle}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-56 flex-shrink-0 space-y-4">
          <div className="card p-3">
            <h3 className="font-bold text-sm text-gray-700 mb-2">🧰 Ferramentas</h3>
            <div className="space-y-1">
              {toolButtons.map((btn) => (
                <button key={btn.tool}
                  onClick={() => {
                    if (btn.tool === 'eraser' && selectedSquare !== null) {
                      handleRemoveSelected()
                      setActiveTool('place')
                    } else {
                      setActiveTool(btn.tool)
                    }
                    setDrawingStart(null)
                    setDrawingCurrent(null)
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTool === btn.tool ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  <span className="text-lg w-6 text-center">{btn.icon}</span><span>{btn.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200">
              {!showClearConfirm ? (
                <button onClick={() => setShowClearConfirm(true)} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                  <span className="text-lg">🗑</span><span>{ptBR.sandbox.tools.clearAll}</span>
                </button>
              ) : (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-xs text-red-700 mb-2 font-semibold">{ptBR.sandbox.tools.clearConfirm}</p>
                  <div className="flex gap-2">
                    <button onClick={handleClearAll} className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-1.5 rounded transition-colors">Sim</button>
                    <button onClick={() => setShowClearConfirm(false)} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 text-xs font-semibold py-1.5 rounded transition-colors">Não</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {(['w', 'b'] as PieceColor[]).map((color) => (
            <div key={color} className="card p-3">
              <h3 className="font-bold text-sm text-gray-700 mb-2 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full inline-block ${color === 'w' ? 'bg-white border-2 border-gray-400' : 'bg-gray-800'}`} />
                {color === 'w' ? ptBR.sandbox.trays.white : ptBR.sandbox.trays.black}
              </h3>
              <div className="space-y-2">
                {PIECE_ORDER.map((type) => {
                  const max = PIECE_MAX[type]
                  const onBoard = countPiecesOnBoard(placedPieces, type, color)
                  const available = max - onBoard
                  const disabled = available <= 0
                  return (
                    <button
                      key={`${color}-${type}`}
                      onClick={() => {
                        if (disabled) return
                        const sq = getAutoPlacementSquare(type, color, placedPieces)
                        if (!sq) return
                        setActiveTool('place')
                        setPlacedPieces((prev) => {
                          const next = new Map(prev)
                          next.set(sq, { type, color })
                          return next
                        })
                        setSelectedSquare(sq)
                      }}
                      className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm transition-all ${
                        disabled
                          ? 'bg-gray-50 text-gray-300 cursor-not-allowed'
                          : 'bg-white hover:bg-blue-50 border border-gray-200 text-gray-700'
                      }`}
                      disabled={disabled}
                    >
                      <span className="text-2xl w-8 text-center">{PIECE_SYMBOLS[color][type]}</span>
                      <span className="flex-1 text-left">{PIECE_LABELS[type]}</span>
                      <span className={`text-xs font-mono ${available === 0 ? 'text-red-400' : 'text-gray-400'}`}>{available}/{max}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 flex justify-center">
          <div ref={boardWrapperRef} className="relative mx-auto" style={{ width: '100%', maxWidth: '500px' }}>
            <ChessBoard
              fen={fen}
              orientation="white"
              freeMove={true}
              selectableEnabled={activeTool === 'place'}
              onMove={handleBoardMove}
              onPieceSelect={handlePieceSelect}
            />
            {boardSize > 0 && (
              <svg
                className="absolute inset-0"
                style={{ pointerEvents: svgActive ? 'auto' : 'none', zIndex: 3 }}
                viewBox={`0 0 ${boardSize} ${boardSize}`}
                onMouseDown={handleSvgMouseDown}
                onMouseMove={handleSvgMouseMove}
                onMouseUp={handleSvgMouseUp}
                onClick={handleSvgClick}
              >
                {selectedSquare && (
                  <rect
                    x={squareCenter(selectedSquare, boardSize).x - (boardSize / BOARD_SIZE) / 2}
                    y={squareCenter(selectedSquare, boardSize).y - (boardSize / BOARD_SIZE) / 2}
                    width={boardSize / BOARD_SIZE} height={boardSize / BOARD_SIZE}
                    fill="rgba(0,200,0,0.25)" stroke="#22c55e" strokeWidth={2} rx={2}
                  />
                )}
                {moveDestsSquares.map((sq) => {
                  const c = squareCenter(sq, boardSize)
                  return <circle key={`d-${sq}`} cx={c.x} cy={c.y} r={boardSize / BOARD_SIZE * 0.17} fill="rgba(0,0,0,0.25)" />
                })}
                {shapes.map((shape) => {
                  const from = squareCenter(shape.from, boardSize)
                  const sqHalf = (boardSize / BOARD_SIZE) / 2
                  if (shape.type === 'x') {
                    const s = sqHalf * 0.7
                    return (
                      <g key={shape.id}>
                        <line x1={from.x - s} y1={from.y - s} x2={from.x + s} y2={from.y + s} stroke={shape.color} strokeWidth={3} strokeLinecap="round" />
                        <line x1={from.x + s} y1={from.y - s} x2={from.x - s} y2={from.y + s} stroke={shape.color} strokeWidth={3} strokeLinecap="round" />
                      </g>
                    )
                  }
                  if (shape.type === 'arrow-straight' && shape.to) {
                    const to = squareCenter(shape.to, boardSize)
                    return (
                      <g key={shape.id}>
                        <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={shape.color} strokeWidth={3} strokeLinecap="round" />
                        <ArrowHead cx={to.x} cy={to.y} angle={Math.atan2(to.y - from.y, to.x - from.x)} size={10} color={shape.color} />
                      </g>
                    )
                  }
                  if (shape.type === 'arrow-curved' && shape.to) {
                    const to = squareCenter(shape.to, boardSize)
                    const mx = (from.x + to.x) / 2; const my = (from.y + to.y) / 2
                    const dx = to.x - from.x; const dy = to.y - from.y
                    const len = Math.sqrt(dx * dx + dy * dy) || 1
                    const cpx = mx + (-dy / len) * (sqHalf * 4)
                    const cpy = my + (dx / len) * (sqHalf * 4)
                    return (
                      <g key={shape.id}>
                        <path d={`M ${from.x} ${from.y} Q ${cpx} ${cpy} ${to.x} ${to.y}`} fill="none" stroke={shape.color} strokeWidth={3} strokeLinecap="round" />
                        <ArrowHead cx={to.x} cy={to.y} angle={Math.atan2(to.y - cpy, to.x - cpx)} size={10} color={shape.color} />
                      </g>
                    )
                  }
                  return null
                })}
                {drawingArrow && (() => {
                  const from = squareCenter(drawingArrow.from, boardSize)
                  const to = squareCenter(drawingArrow.to, boardSize)
                  const sqHalf = (boardSize / BOARD_SIZE) / 2
                  const color = '#ef4444'
                  if (activeTool === 'arrow-straight') {
                    return (
                      <g>
                        <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.8} />
                        <ArrowHead cx={to.x} cy={to.y} angle={Math.atan2(to.y - from.y, to.x - from.x)} size={10} color={color} />
                      </g>
                    )
                  }
                  if (activeTool === 'arrow-curved') {
                    const mx = (from.x + to.x) / 2; const my = (from.y + to.y) / 2
                    const dx = to.x - from.x; const dy = to.y - from.y
                    const len = Math.sqrt(dx * dx + dy * dy) || 1
                    const cpx = mx + (-dy / len) * (sqHalf * 4)
                    const cpy = my + (dx / len) * (sqHalf * 4)
                    return (
                      <g>
                        <path d={`M ${from.x} ${from.y} Q ${cpx} ${cpy} ${to.x} ${to.y}`} fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" opacity={0.8} />
                        <ArrowHead cx={to.x} cy={to.y} angle={Math.atan2(to.y - cpy, to.x - cpx)} size={10} color={color} />
                      </g>
                    )
                  }
                  return null
                })()}
              </svg>
            )}
          </div>
        </div>

        <div className="w-full lg:w-48 flex-shrink-0">
          <div className="card p-3">
            <h3 className="font-bold text-sm text-gray-700 mb-3">{ptBR.sandbox.selected.title}</h3>
            {selectedPiece ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                  <span className="text-4xl">{PIECE_SYMBOLS[selectedPiece.color][selectedPiece.type]}</span>
                  <div>
                    <p className="font-semibold text-gray-900">{PIECE_LABELS[selectedPiece.type]} {selectedPiece.color === 'w' ? 'Branca' : 'Preta'}</p>
                    <p className="text-xs text-gray-500">{selectedSquare!}</p>
                  </div>
                </div>
                <p className="text-xs text-gray-500 italic leading-snug">{PIECE_MOVE_DESC[selectedPiece.type]}</p>
                <div>
                  <label className="text-xs text-gray-600 block mb-1">{ptBR.sandbox.selected.opacity}: {Math.round((pieceOpacities.get(selectedSquare!) ?? 1) * 100)}%</label>
                  <input type="range" min={20} max={100} value={Math.round((pieceOpacities.get(selectedSquare!) ?? 1) * 100)}
                    onChange={(e) => handleOpacityChange(Number(e.target.value) / 100)}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600" />
                </div>
                <button onClick={handleHalfTransparent}
                  className={`w-full text-xs font-semibold py-1.5 rounded-lg transition-colors ${(pieceOpacities.get(selectedSquare!) ?? 1) < 1 ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {ptBR.sandbox.selected.halfTransparent} {(pieceOpacities.get(selectedSquare!) ?? 1) < 1 ? '✓' : ''}
                </button>
                <button onClick={handleRemoveSelected} className="w-full flex items-center justify-center gap-1 text-xs font-semibold py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors">
                  <span>🗑</span><span>{ptBR.sandbox.selected.remove}</span>
                </button>
              </div>
            ) : (
              <p className="text-xs text-gray-400 text-center py-4">{ptBR.sandbox.selected.none}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Sandbox
