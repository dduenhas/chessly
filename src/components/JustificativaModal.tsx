import { useState, useRef, useEffect, useCallback } from 'react'

const GradCapIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c0 2 4 3 6 3s6-1 6-3v-5" />
  </svg>
)

type Tab = 'bncc' | 'computacao'

const bnccData = [
  { ano: '1º Ano', codigo: 'EF01MA11', habilidade: 'Descrever a localização de objetos no espaço e formular instruções de movimentação.', aplicacao: 'Compreensão do tabuleiro (casas brancas e pretas) e noções de frente, trás e diagonais.' },
  { ano: '2º Ano', codigo: 'EF02MA12', habilidade: 'Identificar e registrar a localização e os deslocamentos em malhas quadriculadas.', aplicacao: 'Lições de Movimentos das Peças, entendendo como a Torre ou o Bispo navegam na malha.' },
  { ano: '3º Ano', codigo: 'EF03MA12', habilidade: 'Descrever a movimentação de objetos no espaço, utilizando diferentes pontos de referência.', aplicacao: 'Módulos de Capturas no Xadrez, projetando rotas de ataque e defesa.' },
  { ano: '4º Ano', codigo: 'EF04MA16', habilidade: 'Descrever deslocamentos no espaço por meio de malhas quadriculadas e sistemas de coordenadas.', aplicacao: 'Identificação de casas (ex: e4, f7) e planejamento tático em exercícios progressivos.' },
  { ano: '5º Ano', codigo: 'EF05MA15', habilidade: 'Interpretar, descrever e representar a localização ou movimentação usando coordenadas.', aplicacao: 'Cálculo de variantes e antecipação de lances ao jogar contra o computador (Bot).' },
]

const computacaoData = [
  { eixo: 'Pensamento Computacional', pilar: 'Reconhecimento de Padrões', habilidade: 'Identificar formações de peças recorrentes (ex: padrões de xeque, defesas comuns, cravadas).' },
  { eixo: 'Pensamento Computacional', pilar: 'Algoritmos e Lógica', habilidade: 'Executar uma sequência ordenada de passos (movimentos) para alcançar um objetivo (ex: dar xeque-mate).' },
  { eixo: 'Pensamento Computacional', pilar: 'Decomposição', habilidade: 'Quebrar o objetivo final (vencer o jogo) em problemas menores (dominar o centro, desenvolver peças, proteger o rei).' },
  { eixo: 'Cultura Digital', pilar: 'Letramento Digital', habilidade: 'Navegar em interfaces digitais de forma autônoma, compreendendo botões, feedbacks visuais e barras de progresso.' },
  { eixo: 'Mundo Digital', pilar: 'Interação Humano-Computador', habilidade: 'Jogar contra o "Bot" do Chessly em níveis variados, compreendendo a resposta programada da máquina às suas ações.' },
]

function JustificativaModal() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState<Tab>('bncc')
  const triggerRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  const close = useCallback(() => {
    setOpen(false)
    setTimeout(() => triggerRef.current?.focus(), 0)
  }, [])

  useEffect(() => {
    if (!open) return

    const modal = modalRef.current
    if (!modal) return

    closeRef.current?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        close()
        return
      }

      if (e.key === 'Tab') {
        const focusable = modal.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last?.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first?.focus()
          }
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [open, close])

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen(true)}
        className="fixed bottom-40 left-4 z-40 w-14 h-14 bg-green-700 hover:bg-green-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        title="Justificativa Pedagógica"
        aria-label="Ver Justificativa Pedagógica"
      >
        <GradCapIcon />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={close} />

          <div
            ref={modalRef}
            role="dialog"
            aria-modal="true"
            aria-label="Justificativa Pedagógica"
            className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col"
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-green-700"><GradCapIcon /></span>
                <h2 className="text-xl font-bold text-gray-900">Justificativa Pedagógica</h2>
              </div>
              <button
                ref={closeRef}
                onClick={close}
                className="text-gray-400 hover:text-gray-600 text-2xl leading-none p-1"
                aria-label="Fechar"
              >
                &times;
              </button>
            </div>

            <div className="flex border-b border-gray-200 px-5">
              <button
                onClick={() => setTab('bncc')}
                className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
                  tab === 'bncc'
                    ? 'border-green-600 text-green-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                role="tab"
                aria-selected={tab === 'bncc'}
              >
                Matemática e BNCC
              </button>
              <button
                onClick={() => setTab('computacao')}
                className={`py-3 px-4 text-sm font-semibold border-b-2 transition-colors ${
                  tab === 'computacao'
                    ? 'border-green-600 text-green-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                role="tab"
                aria-selected={tab === 'computacao'}
              >
                Computação e Tecnologias
              </button>
            </div>

            <div className="overflow-y-auto p-5 space-y-5" tabIndex={-1}>
              {tab === 'bncc' && (
                <div role="tabpanel" className="space-y-5">
                  <p className="text-gray-700 leading-relaxed">
                    O Chessly foi desenvolvido como um ambiente gamificado e seguro para potencializar o desenvolvimento cognitivo e socioemocional de alunos do <strong>1º ao 5º ano do Ensino Fundamental</strong>. Utilizando o xadrez como eixo condutor, o aplicativo estimula o raciocínio lógico, a antecipação de cenários, a tomada de decisão e a resiliência.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Nossas trilhas de aprendizagem (Lições, Exercícios e Partidas) foram desenhadas para dialogar diretamente com as <strong>Competências Gerais da BNCC</strong>, as habilidades específicas de <strong>Matemática</strong> e as novas diretrizes da <strong>BNCC Computação</strong> (Norma de Computação na Educação Básica).
                  </p>

                  <h3 className="text-lg font-bold text-gray-900">1. Alinhamento à BNCC (Matemática e Competências Gerais)</h3>
                  <p className="text-gray-700 leading-relaxed">
                    O tabuleiro de xadrez é, por natureza, um plano cartesiano e uma malha quadriculada geométrica. O ato de movimentar peças exige compreensão de espaço, lateralidade e planejamento. Além disso, o ambiente do jogo promove a <strong>Competência Geral 2 da BNCC</strong> (Pensamento científico, crítico e criativo), pois o aluno precisa investigar soluções e resolver problemas complexos a cada jogada.
                  </p>

                  <h4 className="font-semibold text-gray-800">Tabela de Correlação: BNCC - Ensino Fundamental Anos Iniciais</h4>

                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-green-50">
                          <th className="border border-green-200 px-3 py-2 text-left font-semibold text-green-900">Ano</th>
                          <th className="border border-green-200 px-3 py-2 text-left font-semibold text-green-900">Código BNCC</th>
                          <th className="border border-green-200 px-3 py-2 text-left font-semibold text-green-900">Habilidade Desenvolvida</th>
                          <th className="border border-green-200 px-3 py-2 text-left font-semibold text-green-900">Aplicação Prática</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bnccData.map((row) => (
                          <tr key={row.codigo} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-3 py-2 font-medium">{row.ano}</td>
                            <td className="border border-gray-200 px-3 py-2">
                              <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded font-bold text-xs whitespace-nowrap">{row.codigo}</span>
                            </td>
                            <td className="border border-gray-200 px-3 py-2">{row.habilidade}</td>
                            <td className="border border-gray-200 px-3 py-2">{row.aplicacao}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="sm:hidden space-y-3">
                    {bnccData.map((row) => (
                      <div key={row.codigo} className="border border-gray-200 rounded-lg p-3 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gray-900">{row.ano}</span>
                          <span className="inline-block bg-green-100 text-green-800 px-2 py-1 rounded font-bold text-xs">{row.codigo}</span>
                        </div>
                        <p className="text-sm text-gray-700"><span className="font-semibold">Habilidade:</span> {row.habilidade}</p>
                        <p className="text-sm text-gray-600"><span className="font-semibold">Aplicação:</span> {row.aplicacao}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {tab === 'computacao' && (
                <div role="tabpanel" className="space-y-5">
                  <h3 className="text-lg font-bold text-gray-900">2. Alinhamento à BNCC Computação e Tecnologias</h3>
                  <p className="text-gray-700 leading-relaxed">
                    Aprovada pelo MEC, a norma de Computação na Educação Básica traz o <strong>Pensamento Computacional</strong> como um pilar essencial. O xadrez no ambiente digital do Chessly é um laboratório perfeito para os quatro pilares do pensamento computacional: <strong>Decomposição</strong>, <strong>Reconhecimento de Padrões</strong>, <strong>Abstração</strong> e <strong>Algoritmos</strong>.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Quando a criança tenta resolver um exercício de "Xeque-Mate em 1", ela está, na verdade, processando uma instrução algorítmica e reconhecendo um padrão geométrico de vitória.
                  </p>

                  <h4 className="font-semibold text-gray-800">Tabela de Correlação: Eixos de Computação (1º ao 5º Ano)</h4>

                  <div className="hidden sm:block overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-blue-50">
                          <th className="border border-blue-200 px-3 py-2 text-left font-semibold text-blue-900">Eixo Tecnológico</th>
                          <th className="border border-blue-200 px-3 py-2 text-left font-semibold text-blue-900">Pilar Computacional</th>
                          <th className="border border-blue-200 px-3 py-2 text-left font-semibold text-blue-900">Habilidade Desenvolvida no Chessly</th>
                        </tr>
                      </thead>
                      <tbody>
                        {computacaoData.map((row, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-3 py-2 font-medium">{row.eixo}</td>
                            <td className="border border-gray-200 px-3 py-2">{row.pilar}</td>
                            <td className="border border-gray-200 px-3 py-2">{row.habilidade}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="sm:hidden space-y-3">
                    {computacaoData.map((row, i) => (
                      <div key={i} className="border border-gray-200 rounded-lg p-3 space-y-1">
                        <span className="text-xs font-semibold text-blue-700 uppercase">{row.eixo}</span>
                        <p className="text-sm text-gray-900 font-semibold">{row.pilar}</p>
                        <p className="text-sm text-gray-600">{row.habilidade}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <h4 className="font-bold text-green-900 mb-2">Conclusão Pedagógica</h4>
                    <p className="text-sm text-green-800 leading-relaxed">
                      Ao utilizar o Chessly, o estudante não está apenas consumindo tecnologia, mas utilizando-a ativamente para expandir suas capacidades cognitivas. O ambiente modular (Aprender, Exercitar, Jogar) respeita o ritmo individual (design universal da aprendizagem), oferecendo feedback imediato e construtivo, preparando as crianças para os desafios lógicos do século XXI.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default JustificativaModal
