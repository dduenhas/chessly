import { useState, useCallback, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import ptBR from '../../i18n/pt-BR'
import ChessBoard from '../../components/ChessBoard'
import ProgressBar from '../../components/ProgressBar'
import { useProgress } from '../../hooks/useProgress'
import { licoes } from '../../exercises/licoes'

function Licao() {
  const { licaoId } = useParams<{ licaoId: string }>()
  const navigate = useNavigate()
  const { completeLesson, isLessonCompleted } = useProgress()

  const licao = licoes.find((l) => l.id === licaoId)
  const [sectionIndex, setSectionIndex] = useState(0)
  const [quizAnswered, setQuizAnswered] = useState(false)
  const [quizCorrect, setQuizCorrect] = useState(false)
  const [quizSelected, setQuizSelected] = useState<number | null>(null)
  const [showVideo, setShowVideo] = useState(false)
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowVideo(false)
        setFullscreenImage(null)
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Mark lesson as completed as soon as the user reaches the last section
  useEffect(() => {
    if (licao && sectionIndex === licao.sections.length - 1) {
      completeLesson(licao.id, 100)
    }
  }, [sectionIndex, licao, completeLesson])

  const handleQuizAnswer = useCallback(
    (index: number) => {
      if (quizAnswered) return
      setQuizSelected(index)
      setQuizAnswered(true)
      const section = licao!.sections[sectionIndex]
      setQuizCorrect(index === section.correct)
    },
    [quizAnswered, sectionIndex, licao]
  )

  const handleNext = useCallback(() => {
    if (!licao) return
    if (sectionIndex < licao.sections.length - 1) {
      setSectionIndex((i) => i + 1)
      setQuizAnswered(false)
      setQuizCorrect(false)
      setQuizSelected(null)
    } else {
      navigate('/aprender')
    }
  }, [sectionIndex, licao, navigate])

  const handlePrev = useCallback(() => {
    if (sectionIndex > 0) {
      setSectionIndex((i) => i - 1)
      setQuizAnswered(false)
      setQuizCorrect(false)
      setQuizSelected(null)
    }
  }, [sectionIndex])

  if (!licao) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Lição não encontrada</h1>
        <Link to="/aprender" className="btn-primary">
          {ptBR.common.back}
        </Link>
      </div>
    )
  }

  const section = licao.sections[sectionIndex]
  const isLast = sectionIndex === licao.sections.length - 1
  const completed = isLessonCompleted(licao.id)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/aprender" className="text-blue-600 hover:text-blue-800 text-sm">
          ← {ptBR.common.back}
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{licao.title}</h1>
        <ProgressBar value={sectionIndex + 1} max={licao.sections.length} label={`Etapa ${sectionIndex + 1} de ${licao.sections.length}`} />
      </div>

      {completed && (
        <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-3 text-green-700 text-sm">
          ✓ {ptBR.aprender.completed} — <button onClick={() => setSectionIndex(0)} className="underline">{ptBR.aprender.restart}</button>
        </div>
      )}

      <div className="card mb-6">
        {section.type === 'text' && (
          <div>
            {section.title && <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>}
            <div className={`${section.image ? 'flex flex-col sm:flex-row gap-6' : ''}`}>
              <div className={`${section.image ? 'flex-1' : ''} prose text-gray-700 leading-relaxed whitespace-pre-line`}>{section.content}</div>
              {section.image && section.imageVariant === 'movement' && (
                <div className="flex-shrink-0 flex items-start justify-center p-4">
                  <div className="movement-glow-container">
                    <img
                      src={section.image}
                      alt={section.title || 'Diagrama de movimento'}
                      className="w-40 h-40 sm:w-52 sm:h-52 object-contain movement-image"
                      draggable={false}
                    />
                  </div>
                </div>
              )}
              {section.image && section.imageVariant !== 'movement' && (
                <div className="flex-shrink-0 flex items-start justify-center p-4">
                  <div className="piece-glow-container">
                    <img
                      src={section.image}
                      alt={section.title || 'Peça de xadrez'}
                      className="w-32 h-32 sm:w-40 sm:h-40 object-contain rounded-lg piece-image"
                      draggable={false}
                    />
                  </div>
                </div>
              )}
            </div>
            {section.imageBelow && (
              <div className="mt-4 flex justify-center">
                <img
                  src={section.imageBelow}
                  alt={section.title || 'Tabuleiro de xadrez'}
                  className="w-[60%] rounded-lg board-image"
                  onClick={() => setFullscreenImage(section.imageBelow || null)}
                />
              </div>
            )}
            {section.video && (
              <div className="mt-4">
                <button
                  onClick={() => setShowVideo(true)}
                  className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                  Ver vídeo explicativo
                </button>
              </div>
            )}
          </div>
        )}

        {section.type === 'board' && (
          <div>
            {section.title && <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>}
            {section.content && <p className="text-gray-700 mb-6">{section.content}</p>}
            {section.fen && (
              <div className="bg-gray-100 rounded-lg p-4">
                <ChessBoard fen={section.fen} orientation={section.orientation || 'white'} />
              </div>
            )}
          </div>
        )}

        {section.type === 'interactive' && (
          <div>
            {section.title && <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>}
            {section.content && <p className="text-gray-700 mb-6">{section.content}</p>}
            {section.fen && <ChessBoard fen={section.fen} orientation={section.orientation || 'white'} />}
          </div>
        )}

        {section.type === 'quiz' && (
          <div>
            {section.title && <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>}
            <p className="text-lg font-medium text-gray-800 mb-6">{section.question}</p>
            <div className="space-y-3">
              {section.options?.map((option, index) => {
                let btnClass = 'w-full text-left p-4 rounded-lg border-2 transition-colors '
                if (!quizAnswered) {
                  btnClass += 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
                } else if (index === section.correct) {
                  btnClass += 'border-green-500 bg-green-50 text-green-700'
                } else if (index === quizSelected && index !== section.correct) {
                  btnClass += 'border-red-500 bg-red-50 text-red-700'
                } else {
                  btnClass += 'border-gray-200 opacity-50'
                }
                return (
                  <button key={index} onClick={() => handleQuizAnswer(index)} className={btnClass} disabled={quizAnswered}>
                    <span className="font-semibold">{String.fromCharCode(65 + index)}.</span> {option}
                  </button>
                )
              })}
            </div>
            {quizAnswered && (
              <div className={`mt-4 p-4 rounded-lg ${quizCorrect ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
                {quizCorrect ? '✅ Correto! Muito bem!' : `❌ Incorreto. A resposta correta é "${section.options?.[section.correct || 0]}".`}
                {!quizCorrect && section.hint && (
                  <p className="mt-2 text-sm opacity-80">💡 Dica: {section.hint}</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {showVideo && section.video && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 p-4" onClick={() => setShowVideo(false)}>
          <div className="relative w-full max-w-3xl bg-gray-900 rounded-xl overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowVideo(false)}
              className="absolute top-3 right-3 z-10 bg-black bg-opacity-60 hover:bg-opacity-80 text-white rounded-full w-8 h-8 flex items-center justify-center text-xl transition-colors"
              aria-label="Fechar"
            >
              ✕
            </button>
            <div className="relative pt-[56.25%]">
              <iframe
                className="absolute inset-0 w-full h-full"
                src={section.video}
                title="Vídeo explicativo"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      )}

      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 p-4 cursor-zoom-out"
          style={{ animation: 'fade-in 0.2s ease' }}
          onClick={() => setFullscreenImage(null)}
        >
          <button
            onClick={() => setFullscreenImage(null)}
            className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-40 text-white rounded-full w-10 h-10 flex items-center justify-center text-xl transition-colors backdrop-blur-sm"
            aria-label="Fechar"
          >
            ✕
          </button>
          <img
            src={fullscreenImage}
            alt="Tabuleiro de xadrez"
            className="max-w-[95vw] max-h-[95vh] object-contain rounded-lg"
            style={{ animation: 'scale-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <div className="flex justify-between">
        <button onClick={handlePrev} disabled={sectionIndex === 0} className={`btn-secondary ${sectionIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
          ← Anterior
        </button>
        <button onClick={handleNext} className="btn-primary">
          {isLast ? '✓ ' + ptBR.aprender.completed : 'Próximo →'}
        </button>
      </div>
    </div>
  )
}

export default Licao
