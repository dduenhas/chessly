import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useA11y } from '../hooks/useA11y'
import ptBR from '../i18n/pt-BR'

function AdminModal() {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const {
    settings,
    toggleHighContrast,
    setFontSize,
    toggleReduceMotion,
    toggleNarration,
    setVoiceCharacter,
    resetProgress,
  } = useA11y()

  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-20 left-4 z-40 w-14 h-14 bg-gray-700 hover:bg-gray-800 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-all hover:rotate-90"
        title={ptBR.admin.title}
        aria-label={ptBR.admin.title}
      >
        ⚙
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => { setOpen(false); setConfirmReset(false) }} />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-6">
            <button
              onClick={() => { setOpen(false); setConfirmReset(false) }}
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-2xl leading-none"
              aria-label="Fechar"
            >
              &times;
            </button>

            <div className="text-center mb-6">
              <span className="text-5xl">⚙</span>
              <h2 className="text-2xl font-bold text-gray-900 mt-2">{ptBR.admin.title}</h2>
              <p className="text-gray-600 mt-1">{ptBR.admin.subtitle}</p>
            </div>

            <div className="space-y-6">
              {/* Accessibility Settings */}
              <section>
                <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                  ♿ {ptBR.admin.a11y.title}
                </h3>

                {/* High Contrast */}
                <label className="flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer">
                  <span className="text-sm text-gray-700">{ptBR.admin.a11y.highContrast}</span>
                  <button
                    onClick={toggleHighContrast}
                    className={`relative w-11 h-6 rounded-full transition-colors ${settings.highContrast ? 'bg-green-600' : 'bg-gray-300'}`}
                    role="switch"
                    aria-checked={settings.highContrast}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.highContrast ? 'translate-x-5' : ''}`} />
                  </button>
                </label>

                {/* Reduce Motion */}
                <label className="flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer">
                  <span className="text-sm text-gray-700">{ptBR.admin.a11y.reduceMotion}</span>
                  <button
                    onClick={toggleReduceMotion}
                    className={`relative w-11 h-6 rounded-full transition-colors ${settings.reduceMotion ? 'bg-green-600' : 'bg-gray-300'}`}
                    role="switch"
                    aria-checked={settings.reduceMotion}
                  >
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.reduceMotion ? 'translate-x-5' : ''}`} />
                  </button>
                </label>

                {/* Font Size */}
                <div className="py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-700 block mb-2">{ptBR.admin.a11y.fontSize}</span>
                  <div className="flex gap-2">
                    {[1, 1.25, 1.5].map((scale) => (
                      <button
                        key={scale}
                        onClick={() => setFontSize(scale)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          settings.fontSize === scale
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                      >
                        {scale === 1 ? 'A' : scale === 1.25 ? 'A+' : 'A++'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Audio Narration */}
                <div className="py-3 border-b border-gray-100">
                  <label className="flex items-center justify-between cursor-pointer mb-3">
                    <span className="text-sm text-gray-700">{ptBR.admin.a11y.narration}</span>
                    <button
                      onClick={toggleNarration}
                      className={`relative w-11 h-6 rounded-full transition-colors ${settings.narration ? 'bg-green-600' : 'bg-gray-300'}`}
                      role="switch"
                      aria-checked={settings.narration}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.narration ? 'translate-x-5' : ''}`} />
                    </button>
                  </label>

                  {settings.narration && (
                    <div>
                      <span className="text-xs text-gray-500 block mb-2">{ptBR.admin.a11y.voiceCharacter}</span>
                      <div className="flex gap-2">
                        {([
                          { key: 'male', label: ptBR.admin.a11y.voiceMale, desc: ptBR.admin.a11y.voiceMaleDesc },
                          { key: 'female', label: ptBR.admin.a11y.voiceFemale, desc: ptBR.admin.a11y.voiceFemaleDesc },
                          { key: 'robot', label: ptBR.admin.a11y.voiceRobot, desc: ptBR.admin.a11y.voiceRobotDesc },
                        ] as const).map((v) => (
                          <button
                            key={v.key}
                            onClick={() => setVoiceCharacter(v.key)}
                            className={`flex-1 p-3 rounded-lg border-2 text-center transition-colors ${
                              settings.voiceCharacter === v.key
                                ? 'border-green-600 bg-green-50 text-green-700'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600'
                            }`}
                            title={v.desc}
                          >
                            <div className="text-2xl mb-1">{v.label}</div>
                            <div className="text-xs">{v.desc}</div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>

              {/* Reset Progress */}
              <section>
                <h3 className="font-bold text-lg text-red-700 mb-3 flex items-center gap-2">
                  ⚠ {ptBR.admin.reset.title}
                </h3>
                <p className="text-sm text-gray-600 mb-3">{ptBR.admin.reset.description}</p>
                {!confirmReset ? (
                  <button
                    onClick={() => setConfirmReset(true)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors"
                  >
                    {ptBR.admin.reset.button}
                  </button>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-sm text-red-700 mb-3 font-semibold">{ptBR.admin.reset.confirm}</p>
                    <div className="flex gap-3">
                      <button
                        onClick={resetProgress}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition-colors"
                      >
                        {ptBR.admin.reset.yes}
                      </button>
                      <button
                        onClick={() => setConfirmReset(false)}
                        className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded-lg transition-colors"
                      >
                        {ptBR.admin.reset.no}
                      </button>
                    </div>
                  </div>
                )}
              </section>

              {/* WCAG Note */}
              <section className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-blue-700 leading-relaxed">
                  {ptBR.admin.a11y.wcagNote}
                </p>
              </section>

              {/* Sandbox */}
              <section>
                <h3 className="font-bold text-lg text-gray-800 mb-3 flex items-center gap-2">
                  🧪 SandBox
                </h3>
                <p className="text-sm text-gray-600 mb-3">{ptBR.sandbox.subtitle}</p>
                <button
                  onClick={() => { navigate('/sandbox'); setOpen(false); setConfirmReset(false) }}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                  Abrir SandBox
                </button>
              </section>
            </div>

            <button
              onClick={() => { setOpen(false); setConfirmReset(false) }}
              className="mt-6 w-full bg-gray-700 hover:bg-gray-800 text-white font-semibold py-2 rounded-lg transition-colors"
            >
              {ptBR.admin.close}
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default AdminModal
