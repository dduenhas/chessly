const ptBR = {
  app: {
    title: 'Chessly',
    subtitle: 'Aprenda Xadrez',
    tagline: 'Aprenda xadrez do zero! Lições interativas e exercícios práticos em português.',
  },
  nav: {
    home: 'Início',
    aprender: 'Aprender',
    jogar: 'Jogar',
    exercicios: 'Exercícios',
  },
  home: {
    welcome: 'Bem-vindo ao Chessly!',
    description: 'Sua jornada no xadrez começa aqui. Aprenda no seu ritmo com lições interativas, pratique com exercícios e jogue contra o computador.',
    startLearning: 'Começar a Aprender',
    playNow: 'Jogar Agora',
    doExercises: 'Fazer Exercícios',
    features: {
      learn: {
        title: 'Aprenda',
        description: 'Lições passo a passo sobre peças, movimentos e estratégias básicas.',
      },
      play: {
        title: 'Jogue',
        description: 'Pratique contra o computador em diferentes níveis de dificuldade.',
      },
      exercises: {
        title: 'Exercite',
        description: 'Teste seus conhecimentos com exercícios interativos progressivos.',
      },
    },
  },
  aprender: {
    title: 'Lições de Xadrez',
    subtitle: 'Aprenda os fundamentos do xadrez passo a passo.',
    completed: 'Concluído',
    start: 'Começar Lição',
    continue: 'Continuar',
    restart: 'Refazer',
    lessons: {
      pieces: {
        title: 'As Peças',
        description: 'Conheça cada peça do tabuleiro e seu valor.',
      },
      moves: {
        title: 'Movimentos',
        description: 'Aprenda como cada peça se movimenta no tabuleiro.',
      },
      captures: {
        title: 'Capturas',
        description: 'Entenda como capturar as peças do adversário.',
      },
      check: {
        title: 'Xeque',
        description: 'Descubra o que é xeque e como sair dele.',
      },
      checkmate: {
        title: 'Xeque-Mate',
        description: 'Aprenda a dar xeque-mate no rei adversário.',
      },
    },
  },
  jogar: {
    title: 'Jogar contra o Computador',
    subtitle: 'Escolha a dificuldade e pratique suas habilidades.',
    selectLevel: 'Nível do computador:',
    levels: {
      beginner: 'Iniciante',
      easy: 'Fácil',
      medium: 'Médio',
    },
    newGame: 'Novo Jogo',
    yourTurn: 'Sua vez',
    computerThinking: 'Computador pensando...',
    youWin: 'Você venceu!',
    computerWins: 'O computador venceu!',
    draw: 'Empate!',
    waitingForGame: 'Clique em "Novo Jogo" para começar.',
  },
  exercicios: {
    title: 'Exercícios',
    subtitle: 'Teste seus conhecimentos com exercícios interativos.',
    progress: 'Progresso',
    correct: 'Correto!',
    incorrect: 'Incorreto. Tente novamente!',
    hint: 'Dica',
    next: 'Próximo',
    finish: 'Concluir',
    categories: {
      pieces: 'Peças',
      moves: 'Movimentos',
      captures: 'Capturas',
      check: 'Xeque',
      checkmate: 'Xeque-Mate',
    },
  },
  pieces: {
    king: 'Rei',
    queen: 'Dama',
    rook: 'Torre',
    bishop: 'Bispo',
    knight: 'Cavalo',
    pawn: 'Peão',
  },
  corujinha: {
    title: 'Corujinha Pedagógica',
    subtitle: 'Sua assistente de aprendizado no xadrez',
    close: 'Fechar',
    about: {
      title: '🧠 Sobre a Corujinha',
      description:
        'A Corujinha é a assistente pedagógica do Chessly! Ela está aqui para te guiar na jornada de aprendizado do xadrez. Sempre que tiver dúvidas sobre os movimentos das peças, regras ou estratégias, consulte a Corujinha.',
    },
    accessibility: {
      title: '♿ Acessibilidade',
      description:
        'O Chessly conta com o VLibras, a suíte de ferramentas de acessibilidade digital do Governo Federal do Brasil. O ícone azul com mãos no canto direito da tela permite traduzir todo o conteúdo do site para a Língua Brasileira de Sinais (Libras), tornando o aprendizado de xadrez mais inclusivo e acessível para a comunidade surda.',
    },
    howTo: {
      title: '📋 Como usar o Chessly',
      items: [
        'Navegue pelas lições em "Aprender" para conhecer as peças e movimentos.',
        'Pratique com os exercícios interativos em "Exercícios".',
        'Teste suas habilidades em "Jogar" contra o computador.',
        'Use o VLibras (ícone azul à direita) para traduzir o conteúdo para Libras.',
      ],
    },
  },
  admin: {
    title: 'Administração',
    subtitle: 'Gerencie as configurações do jogo e acessibilidade',
    close: 'Fechar',
    reset: {
      title: 'Zerar Progresso',
      description: 'Apaga todo o progresso de lições e exercícios. Use para novos alunos começarem do zero.',
      button: 'Zerar Progresso',
      confirm: 'Tem certeza? Esta ação não pode ser desfeita.',
      yes: 'Sim, zerar tudo',
      no: 'Cancelar',
    },
    a11y: {
      title: 'Recursos de Acessibilidade',
      highContrast: 'Alto Contraste',
      reduceMotion: 'Remover Animações',
      fontSize: 'Tamanho da Fonte',
      narration: 'Narração por Áudio',
      voiceCharacter: 'Personagem da Voz:',
      voiceMale: '👨',
      voiceMaleDesc: 'Homem (neutro)',
      voiceFemale: '👩',
      voiceFemaleDesc: 'Mulher (infantil)',
      voiceRobot: '🤖',
      voiceRobotDesc: 'Robô (infantil)',
      wcagNote: 'Estes recursos seguem as diretrizes W3C WCAG 2.1 para garantir que o Chessly seja acessível a pessoas com diferentes necessidades, incluindo baixa visão, daltonismo e preferências de movimento reduzido.',
    },
  },
  sandbox: {
    title: 'SandBox',
    subtitle: 'Tabuleiro livre para demonstrações e planejamento de aulas',
    tools: {
      place: 'Colocar Peças',
      xMark: 'Marcar X',
      arrowStraight: 'Seta Reta',
      arrowCurved: 'Seta Curva',
      eraser: 'Apagar',
      clearAll: 'Limpar Tudo',
      clearConfirm: 'Tem certeza que deseja limpar todas as peças e marcações?',
    },
    trays: {
      white: 'Peças Brancas',
      black: 'Peças Pretas',
    },
    selected: {
      title: 'Peça Selecionada',
      none: 'Nenhuma peça selecionada',
      opacity: 'Opacidade',
      halfTransparent: '50% Transparente',
      remove: 'Remover Peça',
    },
    backToAdmin: '← Voltar ao Painel',
  },
  common: {
    back: 'Voltar',
    loading: 'Carregando...',
    error: 'Algo deu errado. Tente novamente.',
  },
}

export default ptBR
