export interface Licao {
  id: string
  title: string
  description: string
  sections: LicaoSection[]
}

export interface LicaoSection {
  type: 'text' | 'board' | 'interactive' | 'quiz'
  title?: string
  content?: string
  fen?: string
  video?: string
  orientation?: 'white' | 'black'
  question?: string
  options?: string[]
  correct?: number
  hint?: string
}

export const licoes: Licao[] = [
  {
    id: 'pecas',
    title: 'As Peças',
    description: 'Conheça cada peça do tabuleiro e seu valor.',
    sections: [
      {
        type: 'text',
        title: 'Introdução',
        content: 'O xadrez é jogado em um tabuleiro de 64 casas (8x8). Cada jogador começa com 16 peças: 1 Rei, 1 Dama, 2 Torres, 2 Bispos, 2 Cavalos e 8 Peões. Vamos conhecer cada uma delas!',
      },
      {
        type: 'text',
        title: 'O Rei (♔)',
        content: 'O Rei é a peça mais importante do jogo. Se o seu Rei for capturado, você perde a partida. Por isso, proteger o Rei é essencial. O Rei se move uma casa em qualquer direção: horizontal, vertical ou diagonal. Ele vale o jogo inteiro!',
      },
      {
        type: 'text',
        title: 'A Dama (♕)',
        content: 'A Dama é a peça mais poderosa do tabuleiro. Ela combina os movimentos da Torre e do Bispo: pode se mover quantas casas quiser na horizontal, vertical ou diagonal. A Dama vale 9 pontos.',
      },
      {
        type: 'text',
        title: 'A Torre (♖)',
        content: 'A Torre se move em linha reta na horizontal ou vertical, quantas casas quiser. Ela é muito forte no final do jogo. Cada Torre vale 5 pontos.',
      },
      {
        type: 'text',
        title: 'O Bispo (♗)',
        content: 'O Bispo se move nas diagonais, quantas casas quiser. Cada jogador tem um Bispo que anda nas casas claras e outro nas escuras. Cada Bispo vale 3 pontos.',
      },
      {
        type: 'text',
        title: 'O Cavalo (♘)',
        content: 'O Cavalo tem o movimento mais diferente: ele anda em "L" — duas casas em uma direção e depois uma casa perpendicular. Ele é a única peça que pode pular sobre outras peças. Cada Cavalo vale 3 pontos.',
      },
      {
        type: 'text',
        title: 'O Peão (♙)',
        content: 'O Peão é a peça mais numerosa mas também a mais fraca. Ele só se move para frente, uma casa por vez (ou duas casas no primeiro movimento). O Peão captura na diagonal. Apesar de valer apenas 1 ponto, os Peões são fundamentais para controlar o centro.',
      },
      {
        type: 'quiz',
        title: 'Quiz - As Peças',
        question: 'Qual peça é a mais poderosa do tabuleiro?',
        options: ['Rei', 'Dama', 'Torre', 'Bispo'],
        correct: 1,
        hint: 'Ela combina os movimentos da Torre e do Bispo.',
      },
      {
        type: 'quiz',
        title: 'Quiz - Valor das Peças',
        question: 'Qual peça vale menos pontos?',
        options: ['Cavalo', 'Bispo', 'Peão', 'Torre'],
        correct: 2,
        hint: 'É a peça mais numerosa do tabuleiro.',
      },
    ],
  },
  {
    id: 'movimentos',
    title: 'Movimentos das Peças',
    description: 'Aprenda como cada peça se movimenta no tabuleiro.',
    sections: [
      {
        type: 'text',
        title: 'O Tabuleiro',
        content: 'O tabuleiro de xadrez tem 64 casas, alternando entre claras e escuras. As colunas são identificadas por letras (a-h) e as linhas por números (1-8). As brancas sempre começam na linha 1 e 2, as pretas na linha 7 e 8.',
      },
      {
        type: 'text',
        title: 'Movimento do Peão',
        content: 'O Peão anda uma casa para frente. No seu primeiro movimento, ele pode avançar duas casas. O Peão captura na diagonal (uma casa para frente na diagonal). Se um Peão chegar na última fileira (linha 8 para brancas, linha 1 para pretas), ele é promovido — pode virar Dama, Torre, Bispo ou Cavalo.',
      },
      {
        type: 'text',
        title: 'Movimento da Torre',
        content: 'A Torre se move em linha reta: para cima, baixo, esquerda ou direita, quantas casas quiser, desde que o caminho esteja livre. Ela não pode pular peças.',
      },
      {
        type: 'text',
        title: 'Movimento do Bispo',
        content: 'O Bispo se move nas diagonais, quantas casas quiser. Cada Bispo sempre permanece na mesma cor de casa (um só anda nas brancas, outro só nas pretas).',
      },
      {
        type: 'text',
        title: 'Movimento da Dama',
        content: 'A Dama combina Torre e Bispo: anda na horizontal, vertical e diagonal, quantas casas quiser. É a peça mais versátil!',
      },
      {
        type: 'text',
        title: 'Movimento do Rei',
        content: 'O Rei anda uma casa em qualquer direção. Ele não pode se colocar em xeque (posição onde seria capturado). Existe um movimento especial chamado "roque" onde o Rei anda duas casas em direção a uma Torre.',
      },
      {
        type: 'text',
        title: 'Movimento do Cavalo',
        content: 'O Cavalo anda em "L": duas casas em uma direção e uma na perpendicular. Pense em um L: 2+1. O Cavalo é a única peça que pode pular sobre outras peças (suas ou do adversário).',
      },
      {
        type: 'board',
        title: 'Visualize os Movimentos',
        content: 'Clique nas peças para ver seus movimentos possíveis.',
        fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
        orientation: 'white',
      },
      {
        type: 'quiz',
        title: 'Quiz - Movimentos',
        question: 'Qual peça pode pular sobre outras peças?',
        options: ['Torre', 'Bispo', 'Cavalo', 'Peão'],
        correct: 2,
        hint: 'Seu movimento tem o formato de um "L".',
      },
    ],
  },
  {
    id: 'capturas',
    title: 'Capturas no Xadrez',
    description: 'Entenda como capturar as peças do adversário.',
    sections: [
      {
        type: 'text',
        title: 'O que é uma Captura?',
        content: 'Capturar significa tomar uma peça do adversário. Quando você move sua peça para uma casa ocupada por uma peça inimiga, você remove a peça adversária do tabuleiro. Capturar peças é fundamental para ganhar o jogo!',
      },
      {
        type: 'text',
        title: 'Captura do Peão',
        content: 'O Peão é a única peça que captura de forma diferente de como se move. Ele avança reto, mas captura na diagonal (uma casa para frente na diagonal).',
      },
      {
        type: 'text',
        title: 'Captura En Passant',
        content: '"En Passant" (do francês "de passagem") é uma captura especial de Peão. Se um Peão avança duas casas a partir da posição inicial e para do lado de um Peão adversário, este pode capturá-lo como se ele tivesse andado apenas uma casa. Só pode ser feito no lance seguinte!',
        video: 'https://www.youtube.com/embed/iPdlFXZdRPg',
      },
      {
        type: 'text',
        title: 'Valor das Trocas',
        content: 'Ao capturar, pense no valor das peças: Dama (9) > Torre (5) > Bispo/Cavalo (3) > Peão (1). Trocar uma peça de menor valor por uma de maior valor é vantajoso. Por exemplo, capturar uma Dama com um Bispo é um ótimo negócio!',
      },
      {
        type: 'quiz',
        title: 'Quiz - Capturas',
        question: 'Qual troca é vantajosa para você?',
        options: [
          'Sua Torre (5) pela Dama inimiga (9)',
          'Sua Dama (9) por um Peão (1)',
          'Seu Bispo (3) por um Peão (1)',
          'Sua Torre (5) por um Bispo (3)',
        ],
        correct: 0,
        hint: 'Você quer ganhar mais pontos do que perde.',
      },
    ],
  },
  {
    id: 'xeque',
    title: 'Xeque',
    description: 'Descubra o que é xeque e como sair dele.',
    sections: [
      {
        type: 'text',
        title: 'O que é Xeque?',
        content: 'Xeque é quando o Rei está sendo atacado por uma peça adversária. Se o Rei estiver em xeque, você DEVE resolver isso no seu próximo lance. Existem três maneiras de sair de um xeque.',
      },
      {
        type: 'text',
        title: '1. Mover o Rei',
        content: 'A primeira opção é mover o Rei para uma casa segura, onde ele não esteja sendo atacado por nenhuma peça inimiga.',
      },
      {
        type: 'text',
        title: '2. Bloquear o Ataque',
        content: 'Se o xeque veio de uma peça que ataca à distância (Dama, Torre ou Bispo), você pode colocar uma peça sua entre o Rei e a peça atacante. Isso bloqueia o xeque. Não funciona contra Cavalos!',
      },
      {
        type: 'text',
        title: '3. Capturar a Peça Atacante',
        content: 'Você pode capturar a peça que está dando xeque no seu Rei. Isso elimina a ameaça diretamente.',
      },
      {
        type: 'text',
        title: 'Xeque Duplo',
        content: 'Um xeque duplo acontece quando duas peças atacam o Rei ao mesmo tempo. Nesse caso, a única opção é mover o Rei — você não pode bloquear nem capturar os dois ataques de uma vez!',
      },
      {
        type: 'quiz',
        title: 'Quiz - Xeque',
        question: 'Se você está em xeque, o que NÃO pode fazer?',
        options: [
          'Mover o Rei para uma casa segura',
          'Bloquear o ataque com outra peça',
          'Capturar a peça atacante',
          'Ignorar o xeque e mover um Peão',
        ],
        correct: 3,
        hint: 'Você DEVE resolver o xeque. Ignorar não é uma opção.',
      },
    ],
  },
  {
    id: 'xequemate',
    title: 'Xeque-Mate',
    description: 'Aprenda a dar xeque-mate no rei adversário.',
    sections: [
      {
        type: 'text',
        title: 'O que é Xeque-Mate?',
        content: 'Xeque-mate acontece quando o Rei está em xeque e não há como sair. Ou seja: o Rei não pode se mover para uma casa segura, o ataque não pode ser bloqueado e a peça atacante não pode ser capturada. Xeque-mate = fim do jogo!',
      },
      {
        type: 'text',
        title: 'Mate do Beijo da Morte (Beijo Fatal)',
        content: 'O mate mais simples: a Dama fica ao lado do Rei inimigo, protegida por uma peça sua. O Rei adversário não pode capturar a Dama porque ela está protegida, e não pode fugir.',
        fen: '7k/8/8/8/8/8/8/6QK w - - 0 1',
        video: 'https://www.youtube.com/embed/BvH7DOxslnY',
      },
      {
        type: 'board',
        title: 'Mate com Dama e Rei',
        content: 'Posição de xeque-mate com Dama e Rei contra Rei solitário.',
        fen: '6k1/8/6K1/8/8/8/8/6Q1 b - - 0 1',
      },
      {
        type: 'text',
        title: 'Mate do Corredor',
        content: 'Com duas Torres ou Dama e Torre, você pode dar mate "empurrando" o Rei inimigo para a borda do tabuleiro. As peças pesadas controlam fileiras inteiras.',
        fen: '1k6/1R6/8/8/8/8/8/R3K3 w - - 0 1',
        video: 'https://www.youtube.com/embed/t9XhfpFMZ5o',
      },
      {
        type: 'quiz',
        title: 'Quiz - Xeque-Mate',
        question: 'O que é necessário para o xeque-mate?',
        options: [
          'O Rei estar em xeque',
          'O Rei estar em xeque e não ter como escapar',
          'Capturar a Dama adversária',
          'Ter mais peças que o adversário',
        ],
        correct: 1,
        hint: 'É o fim do jogo.',
      },
    ],
  },
]
