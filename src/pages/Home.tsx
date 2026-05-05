import { Link } from 'react-router-dom'
import ptBR from '../i18n/pt-BR'
import ProgressBar from '../components/ProgressBar'
import { useProgress } from '../hooks/useProgress'
import { licoes } from '../exercises/licoes'

function Home() {
  const { progress } = useProgress()
  const completedLessons = Object.values(progress.lessons).filter((l) => l.completed).length
  const completedExercises = Object.values(progress.exercises).filter((e) => e.completed).length

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          <span className="text-green-600">♞</span> {ptBR.app.title}
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          {ptBR.home.description}
        </p>
      </div>

      {(completedLessons > 0 || completedExercises > 0) && (
        <div className="max-w-md mx-auto mb-12">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">Seu Progresso</h3>
            <div className="space-y-3">
              <ProgressBar
                value={completedLessons}
                max={licoes.length}
                label="Lições"
                color="bg-blue-600"
              />
              <ProgressBar
                value={completedExercises}
                max={25}
                label="Exercícios"
                color="bg-green-600"
              />
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <Link to="/aprender" className="card hover:border-blue-200 border-2 border-transparent text-left">
          <div className="text-5xl mb-4">📖</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{ptBR.home.features.learn.title}</h3>
          <p className="text-gray-600">{ptBR.home.features.learn.description}</p>
          <div className="mt-4">
            <span className="text-blue-600 font-semibold">{ptBR.home.startLearning} →</span>
          </div>
        </Link>

        <Link to="/jogar" className="card hover:border-purple-200 border-2 border-transparent text-left">
          <div className="text-5xl mb-4">🎮</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{ptBR.home.features.play.title}</h3>
          <p className="text-gray-600">{ptBR.home.features.play.description}</p>
          <div className="mt-4">
            <span className="text-purple-600 font-semibold">{ptBR.home.playNow} →</span>
          </div>
        </Link>

        <Link to="/exercicios" className="card hover:border-green-200 border-2 border-transparent text-left">
          <div className="text-5xl mb-4">🎯</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{ptBR.home.features.exercises.title}</h3>
          <p className="text-gray-600">{ptBR.home.features.exercises.description}</p>
          <div className="mt-4">
            <span className="text-green-600 font-semibold">{ptBR.home.doExercises} →</span>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Home
