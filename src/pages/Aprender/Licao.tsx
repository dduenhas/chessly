import { useState, useCallback } from 'react'
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
      completeLesson(licao.id, 100)
      navigate('/aprender')
    }
  }, [sectionIndex, licao, navigate, completeLesson])

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
            <div className="prose text-gray-700 leading-relaxed whitespace-pre-line">{section.content}</div>
          </div>
        )}

        {section.type === 'board' && (
          <div>
            {section.title && <h2 className="text-xl font-bold text-gray-900 mb-4">{section.title}</h2>}
            {section.content && <p className="text-gray-700 mb-6">{section.content}</p>}
            {section.fen && (
              <div className="bg-gray-100 rounded-lg p-4">
                <ChessBoard fen={section.fen} orientation={section.orientation || 'white'} viewOnly />
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
