import { useState, useMemo, useCallback } from 'react'
import { Link } from 'react-router-dom'
import ptBR from '../i18n/pt-BR'
import ProgressBar from '../components/ProgressBar'
import { useProgress } from '../hooks/useProgress'
import { exercises } from '../exercises/exercicios'

type Category = string

const categories: { key: Category; label: string }[] = [
  { key: 'pieces', label: ptBR.exercicios.categories.pieces },
  { key: 'moves', label: ptBR.exercicios.categories.moves },
  { key: 'captures', label: ptBR.exercicios.categories.captures },
  { key: 'check', label: ptBR.exercicios.categories.check },
  { key: 'checkmate', label: ptBR.exercicios.categories.checkmate },
]

function Exercicios() {
  const { progress, completeExercise, isExerciseCompleted } = useProgress()
  const [selectedCategory, setSelectedCategory] = useState<Category | ''>('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answered, setAnswered] = useState(false)
  const [quizMode, setQuizMode] = useState(false)

  const filtered = useMemo(() => {
    if (!selectedCategory) return exercises
    return exercises.filter((e) => e.category === selectedCategory)
  }, [selectedCategory])

  const totalCompleted = Object.values(progress.exercises).filter((e) => e.completed).length

  const startQuiz = useCallback((cat: Category) => {
    setSelectedCategory(cat)
    setCurrentIndex(0)
    setAnswered(false)
    setSelectedAnswer(null)
    setQuizMode(true)
  }, [])

  const handleAnswer = useCallback(
    (index: number) => {
      if (answered) return
      setSelectedAnswer(index)
      setAnswered(true)
      const ex = filtered[currentIndex]
      if (index === ex.correct) {
        completeExercise(ex.id)
      }
    },
    [answered, currentIndex, filtered, completeExercise]
  )

  const handleNext = useCallback(() => {
    if (currentIndex < filtered.length - 1) {
      setCurrentIndex((i) => i + 1)
      setAnswered(false)
      setSelectedAnswer(null)
    } else {
      setQuizMode(false)
      setSelectedCategory('')
    }
  }, [currentIndex, filtered.length])

  if (quizMode) {
    const ex = filtered[currentIndex]
    const isCorrect = selectedAnswer === ex.correct

    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <button onClick={() => setQuizMode(false)} className="text-blue-600 hover:text-blue-800 text-sm">
            ← {ptBR.common.back}
          </button>
          <span className="text-sm text-gray-500">
            {currentIndex + 1} / {filtered.length}
          </span>
        </div>

        <ProgressBar
          value={currentIndex + 1}
          max={filtered.length}
          label={`${ptBR.exercicios.progress}`}
          color="bg-green-600"
        />

        <div className="card mt-6">
          <div className="text-sm text-gray-500 mb-2 uppercase tracking-wide">
            {categories.find((c) => c.key === ex.category)?.label || ex.category}
          </div>
          <p className="text-lg font-medium text-gray-800 mb-6">{ex.question}</p>

          <div className="space-y-3">
            {ex.options.map((option, index) => {
              let btnClass = 'w-full text-left p-4 rounded-lg border-2 transition-colors '
              if (!answered) {
                btnClass += 'border-gray-200 hover:border-blue-400 hover:bg-blue-50'
              } else if (index === ex.correct) {
                btnClass += 'border-green-500 bg-green-50 text-green-700'
              } else if (index === selectedAnswer && index !== ex.correct) {
                btnClass += 'border-red-500 bg-red-50 text-red-700'
              } else {
                btnClass += 'border-gray-200 opacity-50'
              }
              return (
                <button key={index} onClick={() => handleAnswer(index)} className={btnClass} disabled={answered}>
                  <span className="font-semibold">{String.fromCharCode(65 + index)}.</span> {option}
                </button>
              )
            })}
          </div>

          {answered && (
            <div className={`mt-4 p-4 rounded-lg ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className={`font-semibold ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {isCorrect ? '✅ ' + ptBR.exercicios.correct : '❌ ' + ptBR.exercicios.incorrect}
              </p>
              <p className="mt-2 text-gray-700">{ex.explanation}</p>
            </div>
          )}

          {answered && (
            <button onClick={handleNext} className="btn-primary w-full mt-4">
              {currentIndex < filtered.length - 1 ? ptBR.exercicios.next + ' →' : '✓ ' + ptBR.exercicios.finish}
            </button>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{ptBR.exercicios.title}</h1>
        <p className="text-gray-600">{ptBR.exercicios.subtitle}</p>
      </div>

      <div className="max-w-md mx-auto mb-8">
        <ProgressBar value={totalCompleted} max={exercises.length} label={ptBR.exercicios.progress} color="bg-green-600" />
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => {
          const catExercises = exercises.filter((e) => e.category === cat.key)
          const completedCount = catExercises.filter((e) => isExerciseCompleted(e.id)).length

          return (
            <div key={cat.key} className="card flex flex-col">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{cat.label}</h3>
              <p className="text-sm text-gray-500 mb-3">
                {completedCount}/{catExercises.length} {ptBR.aprender.completed.toLowerCase()}
              </p>
              <ProgressBar value={completedCount} max={catExercises.length} color="bg-green-500" />
              <button onClick={() => startQuiz(cat.key)} className="btn-primary w-full mt-4">
                {completedCount === catExercises.length ? '🔄 Refazer' : '▶ Começar'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Exercicios
