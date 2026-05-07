import { useState } from 'react'
import ptBR from '../i18n/pt-BR'

function Corujinha() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 right-4 z-40 w-14 h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-lg flex items-center justify-center text-3xl transition-all hover:scale-110 active:scale-95"
        title={ptBR.corujinha.title}
        aria-label={ptBR.corujinha.title}
      >
        🦉
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-6">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl leading-none"
              aria-label="Fechar"
            >
              &times;
            </button>

            <div className="text-center mb-6">
              <span className="text-5xl">🦉</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-2">{ptBR.corujinha.title}</h2>
              <p className="text-gray-600 mt-1">{ptBR.corujinha.subtitle}</p>
            </div>

            <div className="space-y-6">
              <section>
                <h3 className="font-bold text-lg text-amber-700 mb-2">{ptBR.corujinha.about.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{ptBR.corujinha.about.description}</p>
              </section>

              <section>
                <h3 className="font-bold text-lg text-amber-700 mb-2">{ptBR.corujinha.accessibility.title}</h3>
                <p className="text-gray-700 text-sm leading-relaxed">{ptBR.corujinha.accessibility.description}</p>
              </section>

              <section>
                <h3 className="font-bold text-lg text-amber-700 mb-2">{ptBR.corujinha.howTo.title}</h3>
                <ul className="text-gray-700 text-sm space-y-1 list-disc list-inside leading-relaxed">
                  {ptBR.corujinha.howTo.items.map((item: string, i: number) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </section>
            </div>

            <button
              onClick={() => setOpen(false)}
              className="mt-6 w-full bg-amber-500 hover:bg-amber-600 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              {ptBR.corujinha.close}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default Corujinha
