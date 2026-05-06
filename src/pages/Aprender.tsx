import { Link } from 'react-router-dom'
import ptBR from '../i18n/pt-BR'
import { useProgress } from '../hooks/useProgress'
import { licoes } from '../exercises/licoes'

function Aprender() {
  const { isLessonCompleted } = useProgress()

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">{ptBR.aprender.title}</h1>
        <p className="text-lg text-gray-600">{ptBR.aprender.subtitle}</p>
      </div>

      <div className="space-y-4">
        {licoes.map((licao, index) => {
          const completed = isLessonCompleted(licao.id)
          return (
            <Link
              key={licao.id}
              to={`/aprender/${licao.id}`}
              className={`card flex items-center gap-6 border-2 border-transparent group ${
                completed ? 'hover:border-green-200' : 'hover:border-blue-200'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold flex-shrink-0 transition-transform group-hover:scale-110 ${
                  completed ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                }`}
              >
                {completed ? '✓' : index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-gray-900">{licao.title}</h3>
                  {completed && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                      {ptBR.aprender.completed}
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mt-1">{licao.description}</p>
              </div>
              <div className="text-2xl transition-transform group-hover:scale-125 group-hover:translate-x-1" style={{ display: 'inline-block' }}>→</div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export default Aprender
