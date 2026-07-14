// ============================================================
// Lesson Data Types
// ============================================================

export interface TableRow {
  cells: string[];
  isHeader?: boolean;
}

export interface DialogueLine {
  speaker: string;
  text: string;
}

export interface LessonSection {
  type: 'text' | 'table' | 'dialogue' | 'vocabulary' | 'tip' | 'grammar' | 'objective' | 'warmup' | 'practice';
  title: string;
  content: string | string[] | TableRow[] | DialogueLine[];
}

export interface ExerciseQuestion {
  id: string;
  prompt: string;
  answer: string;
  options?: string[];
}

export interface Exercise {
  id: string;
  title: string;
  type: 'fill' | 'choice' | 'match' | 'translate';
  questions: ExerciseQuestion[];
}

export interface Lesson {
  id: string;
  title: string;
  icon: string;
  description: string;
  sections: LessonSection[];
  exercises: Exercise[];
}

// ============================================================
// Lesson 2 – Fazendo Perguntas e Apresentando Coisas
// ============================================================

const licao2: Lesson = {
  id: 'licao-2',
  title: 'Fazendo Perguntas e Apresentando Coisas',
  icon: '❓',
  description: 'Compreenda e use pronomes interrogativos (Wh-words) e artigos (a, an, the)',
  sections: [
    {
      type: 'objective',
      title: '🎯 Objetivo da Lição',
      content: [
        'Compreender e usar corretamente os pronomes interrogativos (Wh- questions)',
        'Aprender e aplicar os artigos definidos e indefinidos ("the", "a", "an")',
        'Ampliar vocabulário e habilidades de fala e escuta com perguntas básicas',
      ],
    },
    {
      type: 'warmup',
      title: '🔥 Warm-Up: O que você perguntaria?',
      content: [
        'Observe os desenhos abaixo (exemplo de uma mochila, um cachorro, uma pessoa).',
        'Pense: o que você perguntaria sobre isso? (Use: o quê? quem? onde? como?)',
        '',
        'Exemplo:',
        'What is this?',
        'Who is he?',
        'Where is the bag?',
      ],
    },
    {
      type: 'dialogue',
      title: '🎧 Listening & Speaking: "At the Park"',
      content: [
        { speaker: 'Anna', text: "Hi! What's your name?" },
        { speaker: 'Tom', text: "I'm Tom." },
        { speaker: 'Anna', text: 'Where are you from?' },
        { speaker: 'Tom', text: "I'm from New York. And you?" },
        { speaker: 'Anna', text: 'Who is that?' },
        { speaker: 'Tom', text: "That's my brother. He's 10." },
        { speaker: 'Anna', text: "What's in your bag?" },
        { speaker: 'Tom', text: 'A sandwich and an apple!' },
      ] as DialogueLine[],
    },
    {
      type: 'tip',
      title: '🔁 Repita com atenção',
      content: 'Escute (ou leia em voz alta) e repita cada linha. Faça a voz dos personagens!',
    },
    {
      type: 'vocabulary',
      title: '🔍 Pronomes Interrogativos (Wh- Words)',
      content: [
        { cells: ['Palavra', 'Tradução', 'Exemplo'], isHeader: true },
        { cells: ['What', 'O quê / Qual', 'What is this? (O que é isso?)'] },
        { cells: ['Where', 'Onde', 'Where are you from? (De onde você é?)'] },
        { cells: ['Who', 'Quem', 'Who is that? (Quem é aquele?)'] },
        { cells: ['When', 'Quando', 'When is your birthday? (Quando é seu aniversário?)'] },
        { cells: ['Why', 'Por quê', 'Why are you sad? (Por que você está triste?)'] },
        { cells: ['How', 'Como', 'How are you? (Como você está?)'] },
      ] as TableRow[],
    },
    {
      type: 'vocabulary',
      title: '📚 Artigos em Inglês',
      content: [
        { cells: ['Artigo', 'Uso', 'Exemplo'], isHeader: true },
        { cells: ['a', 'antes de palavras iniciadas por som de consoante', 'a dog, a car'] },
        { cells: ['an', 'antes de palavras iniciadas por som de vogal', 'an apple, an umbrella'] },
        { cells: ['the', 'quando nos referimos a algo específico ou já mencionado', 'the book, the sun'] },
      ] as TableRow[],
    },
    {
      type: 'tip',
      title: '⚠️ Observação Importante',
      content: [
        'Use "a/an" para coisas não específicas.',
        'Use "the" quando todos sabem de qual coisa você está falando.',
      ],
    },
    {
      type: 'grammar',
      title: '📘 Gramática: Fazendo perguntas e usando artigos',
      content: [
        '1. Estrutura básica de perguntas com Wh- words:',
        '',
        'Wh-word + verbo + sujeito + complemento?',
        '',
        'Exemplos:',
        'What is your name?',
        'Where is the pen?',
        'Who is that woman?',
        '',
        '2. Uso dos artigos "a", "an", "the" com substantivos simples:',
        'I have a book.',
        'She is eating an orange.',
        'He is reading the newspaper.',
      ],
    },
    {
      type: 'practice',
      title: '🎭 Prática Oral',
      content: [
        'Role-play (em dupla ou sozinho com espelho):',
        '',
        'Situação: Conhecendo alguém novo',
        '',
        'You: Hi! What\'s your name?',
        'Partner: My name is ___.',
        'You: Where are you from?',
        'Partner: I\'m from ___.',
        'You: What is in your bag?',
        'Partner: I have a ___ and an ___.',
        'You: Nice to meet you!',
        '',
        'Dica para autoestudo: Grave sua voz e escute depois.',
      ],
    },
    {
      type: 'practice',
      title: '👅 Trava-língua (Tongue Twister)',
      content: 'A happy hippo has a hat and an apple. 🔁 Repita 3x rápido!',
    },
    {
      type: 'tip',
      title: '🌍 Curiosidade Cultural – O artigo "the" no inglês',
      content: [
        'Diferente do português, em inglês não usamos "the" com nomes próprios ou países em geral.',
        'Errado: The Brazil',
        'Certo: Brazil',
        'Exceção: The United States, The Netherlands',
      ],
    },
    {
      type: 'text',
      title: '🔁 Revisão',
      content: [
        '✅ Wh- words servem para perguntas',
        '✅ "a" e "an" = indefinidos (coisas genéricas)',
        '✅ "the" = definido (coisa específica)',
        '✅ A estrutura básica de perguntas: Wh-word + verbo + sujeito + resto da frase',
      ],
    },
    {
      type: 'practice',
      title: '🏠 Tarefa de Casa',
      content: [
        'Escreva 5 frases com "a" ou "an".',
        'Escreva 3 frases com "the".',
        'Escreva 3 perguntas usando what, who, where.',
      ],
    },
  ],
  exercises: [
    {
      id: 'licao-2-ex-a',
      title: 'A. Complete com a, an ou the',
      type: 'fill',
      questions: [
        { id: 'l2a1', prompt: 'I see ___ elephant.', answer: 'an' },
        { id: 'l2a2', prompt: 'She has ___ umbrella.', answer: 'an' },
        { id: 'l2a3', prompt: '___ sun is hot today.', answer: 'The' },
        { id: 'l2a4', prompt: 'I need ___ pen.', answer: 'a' },
        { id: 'l2a5', prompt: 'He is eating ___ banana.', answer: 'a' },
      ],
    },
    {
      id: 'licao-2-ex-b',
      title: 'B. Faça perguntas usando Wh-words',
      type: 'fill',
      questions: [
        { id: 'l2b1', prompt: '(he?)', answer: 'Who is he?' },
        { id: 'l2b2', prompt: '(this?)', answer: 'What is this?' },
        { id: 'l2b3', prompt: '(you from?)', answer: 'Where are you from?' },
        { id: 'l2b4', prompt: '(your favorite color?)', answer: 'What is your favorite color?' },
        { id: 'l2b5', prompt: '(they?)', answer: 'Who are they?' },
      ],
    },
  ],
};

// ============================================================
// Lesson 3 – Revisando e Praticando: Quem é Você? O Que é Isso?
// ============================================================

const licao3: Lesson = {
  id: 'licao-3',
  title: 'Revisando e Praticando: Quem é Você? O Que é Isso?',
  icon: '🇺🇸',
  description: 'Revise e pratique saudações, perguntas básicas e artigos',
  sections: [
    {
      type: 'objective',
      title: '🎯 Objetivo da Lição',
      content: [
        'Praticar estruturas e vocabulário das lições 1 e 2',
        'Usar saudações, perguntas básicas e artigos de forma espontânea',
        'Ganhar confiança em diálogos simples',
      ],
    },
    {
      type: 'text',
      title: '⏪ Revisão Rápida',
      content: [
        '🧠 Lembre-se:',
        '',
        'Wh- Questions:',
        'What is your name?',
        'Where are you from?',
        'Who is that?',
        'What is this?',
        '',
        'Artigos:',
        'a + consoante (a book)',
        'an + vogal (an apple)',
        'the = coisa específica (the book on the table)',
      ],
    },
    {
      type: 'practice',
      title: '🧩 Parte 2 – Quem é Quem?',
      content: [
        'Leia o texto e sublinhe todos os artigos (a, an, the):',
        '',
        'Hello! I\'m Alex. I\'m from Chicago. I have a dog and an old camera.',
        'The dog is funny! I also have a friend. His name is Ben. He has an orange and a small book.',
        'The book is in his bag. The orange is on the table.',
        '',
        'Respostas: a = 3, an = 2, the = 4',
      ],
    },
    {
      type: 'practice',
      title: '🎭 Parte 4 – Role-Play (Faça de Conta)',
      content: [
        'Situação 1 – Primeiro Dia de Aula',
        '',
        'Aluno A: Faça perguntas para conhecer Aluno B. Use:',
        "What's your name?",
        'Where are you from?',
        "What's in your bag?",
        'Who is your friend?',
        '',
        'Aluno B: Responda com criatividade. Invente detalhes!',
        '',
        'Autoestudo: Faça as duas partes sozinho, com espelho ou grave um áudio.',
      ],
    },
    {
      type: 'practice',
      title: '🎨 Parte 5 – Desenhe e Descreva',
      content: [
        'Desenhe sua mochila ou bolsa da escola.',
        'Depois, escreva o que há dentro dela em inglês. Use: a / an / the',
        'Ex: I have a pen, an eraser, and the keys.',
      ],
    },
    {
      type: 'practice',
      title: '✍️ Parte 6 – Escreva Sobre Você',
      content: [
        'Escreva um mini texto com as estruturas que você aprendeu:',
        '',
        'Use as frases como modelo:',
        'My name is ___. I\'m from ___.',
        'I have a __ and an __.',
        'The ___ is in my bag.',
        'My friend is ___.',
        'He/She has a ___.',
        '',
        'Dica: Tente usar 3 Wh-questions, 3 artigos, e ao menos 5 frases.',
      ],
    },
    {
      type: 'practice',
      title: '🧠 Desafio Extra – Monte um Quadro de Perguntas',
      content: [
        'Escreva 5 perguntas diferentes usando: What, Where, Who, How, When',
        'Depois, responda suas próprias perguntas.',
      ],
    },
    {
      type: 'text',
      title: '🏁 Conclusão',
      content: 'Parabéns! Você está construindo frases, fazendo perguntas, e se apresentando com confiança! Na próxima lição, vamos aprender sobre cores, números e objetos da sala de aula.',
    },
  ],
  exercises: [
    {
      id: 'licao-3-ex-a',
      title: 'A. Complete as perguntas com Wh-words corretos',
      type: 'fill',
      questions: [
        { id: 'l3a1', prompt: '___ is your name?', answer: 'What' },
        { id: 'l3a2', prompt: '___ is that woman?', answer: 'Who' },
        { id: 'l3a3', prompt: '___ are you from?', answer: 'Where' },
        { id: 'l3a4', prompt: '___ is in your backpack?', answer: 'What' },
        { id: 'l3a5', prompt: '___ is your teacher?', answer: 'Who' },
      ],
    },
    {
      id: 'licao-3-ex-c',
      title: 'C. Marque a alternativa correta',
      type: 'choice',
      questions: [
        {
          id: 'l3c1',
          prompt: 'What ___ in your bag?',
          answer: 'is',
          options: ['is', 'are', 'am'],
        },
        {
          id: 'l3c2',
          prompt: 'She has ___ apple.',
          answer: 'an',
          options: ['a', 'an', 'the'],
        },
        {
          id: 'l3c3',
          prompt: '___ is that man?',
          answer: 'Who',
          options: ['Why', 'Who', 'What'],
        },
        {
          id: 'l3c4',
          prompt: 'I have ___ book and ___ umbrella.',
          answer: 'a / an',
          options: ['an / a', 'a / an', 'the / the'],
        },
      ],
    },
  ],
};

// ============================================================
// Lesson 4 – Preposições em Ação: Onde? Com Quem? Como?
// ============================================================

const licao4: Lesson = {
  id: 'licao-4',
  title: 'Preposições em Ação: Onde? Com Quem? Como?',
  icon: '📍',
  description: 'Aprenda preposições de lugar, companhia, transporte e tempo',
  sections: [
    {
      type: 'objective',
      title: '🎯 Objetivos da Lição',
      content: [
        'Identificar e usar corretamente as preposições básicas de lugar, companhia, transporte e tempo.',
        'Construir frases mais completas com vocabulário já aprendido.',
        'Aumentar fluência com estruturas simples e úteis.',
      ],
    },
    {
      type: 'warmup',
      title: '🔥 Warm-Up – O que você vê?',
      content: [
        'Imagine a sua sala de aula ou quarto. Onde estão os objetos?',
        '',
        'Responda em inglês:',
        'The book is ___ the table.',
        'My bag is ___ the chair.',
        'The teacher is ___ the board.',
        '',
        'Use: in, on, under, next to',
      ],
    },
    {
      type: 'vocabulary',
      title: '📖 Vocabulário-Chave – Preposições Básicas',
      content: [
        { cells: ['Preposição', 'Significado', 'Exemplo em Inglês', 'Tradução'], isHeader: true },
        { cells: ['in', 'dentro', 'The book is in the bag.', 'O livro está dentro da mochila.'] },
        { cells: ['on', 'sobre/em cima', 'The phone is on the table.', 'O celular está em cima da mesa.'] },
        { cells: ['at', 'em (local exato ou tempo)', 'I am at school.', 'Estou na escola.'] },
        { cells: ['with', 'com (companhia)', 'I am with my friend.', 'Estou com meu amigo.'] },
        { cells: ['by', 'ao lado/perto/por', 'The pen is by the notebook.', 'A caneta está perto do caderno.'] },
        { cells: ['of', 'de (posse)', 'The name of the book is "English".', 'O nome do livro é "English".'] },
        { cells: ['under', 'embaixo', 'The ball is under the table.', 'A bola está embaixo da mesa.'] },
      ] as TableRow[],
    },
    {
      type: 'grammar',
      title: '🗣️ Gramática em Ação – Como Usar?',
      content: [
        'A. Preposições de Lugar:',
        'The pen is on the desk.',
        'The keys are in the bag.',
        'The dog is under the chair.',
        '',
        'B. Preposições de Companhia e Transporte:',
        "I'm with my teacher.",
        'She comes to school by bike.',
        'We are going by bus.',
        '',
        'C. Preposições de Tempo (introdução leve):',
        "The class is at 10 o'clock.",
        'The party is on Friday.',
        'My birthday is in May.',
      ],
    },
    {
      type: 'practice',
      title: '🎭 Prática Oral – "Descreva a Cena!"',
      content: [
        'Escolha um lugar da sua casa ou escola.',
        'Fale em voz alta (ou escreva) onde estão os objetos usando: in, on, under, by, next to, at',
        '',
        'Exemplos:',
        'The lamp is on the desk.',
        'The bag is under the chair.',
        "I'm at school with my friend.",
      ],
    },
    {
      type: 'practice',
      title: '🎨 Atividade Criativa – Desenhe & Escreva',
      content: [
        'Faça um desenho de um quarto (pode ser o seu).',
        'Depois, escreva 5 frases descrevendo onde estão os objetos.',
        '',
        'Ex:',
        'The TV is on the shelf.',
        'The backpack is under the bed.',
        'My cat is in the box.',
      ],
    },
    {
      type: 'vocabulary',
      title: '🇺🇸 Expressões Reais com Preposições',
      content: [
        { cells: ['Expressão', 'Significado'], isHeader: true },
        { cells: ['on time', 'pontualmente'] },
        { cells: ['in love', 'apaixonado'] },
        { cells: ['with pleasure', 'com prazer'] },
        { cells: ['at home', 'em casa'] },
        { cells: ['by myself', 'sozinho'] },
        { cells: ['out of order', 'fora de serviço'] },
      ] as TableRow[],
    },
    {
      type: 'tip',
      title: '💡 Dica',
      content: 'Não precisa decorar tudo agora, mas fique atento a essas expressões. Elas são muito comuns!',
    },
    {
      type: 'practice',
      title: '🧠 Desafio Final – Monte Suas Frases',
      content: [
        'Escreva 5 frases verdadeiras sobre você usando diferentes preposições:',
        'I live ___',
        'My phone is ___',
        'I go to school ___',
        'I study English ___',
        "I'm with ___",
      ],
    },
    {
      type: 'text',
      title: '🏁 Conclusão',
      content: 'Agora você pode falar onde está algo, com quem você está, como chegou em um lugar e quando algo acontece! Essas preposições estão em quase todas as frases do inglês – continue praticando para falar com mais naturalidade!',
    },
  ],
  exercises: [
    {
      id: 'licao-4-ex-a',
      title: 'A. Complete com a preposição correta',
      type: 'fill',
      questions: [
        { id: 'l4a1', prompt: 'The keys are ___ the drawer.', answer: 'in' },
        { id: 'l4a2', prompt: 'He is going to school ___ bus.', answer: 'by' },
        { id: 'l4a3', prompt: "I'm ___ the park with my dog.", answer: 'in' },
        { id: 'l4a4', prompt: 'The pencil is ___ the table.', answer: 'on' },
        { id: 'l4a5', prompt: 'We are studying English ___ 9 a.m.', answer: 'at' },
        { id: 'l4a6', prompt: 'The name ___ my friend is Mark.', answer: 'of' },
      ],
    },
    {
      id: 'licao-4-ex-b',
      title: 'B. Corrija a frase (1 erro em cada)',
      type: 'fill',
      questions: [
        { id: 'l4b1', prompt: 'Corrija: The book is in the the table.', answer: 'The book is on the table.' },
        { id: 'l4b2', prompt: 'Corrija: I am with my friend by the school.', answer: 'I am with my friend at the school.' },
        { id: 'l4b3', prompt: 'Corrija: She is on her house at 6.', answer: 'She is in her house at 6.' },
        { id: 'l4b4', prompt: 'Corrija: My phone is under of the sofa.', answer: 'My phone is under the sofa.' },
      ],
    },
  ],
};

// ============================================================
// Lesson 5 – O Que É Isso? De Quem É?
// ============================================================

const licao5: Lesson = {
  id: 'licao-5',
  title: 'O Que É Isso? De Quem É?',
  icon: '👆',
  description: 'Domine pronomes demonstrativos, possessivos e perguntas com whose',
  sections: [
    {
      type: 'objective',
      title: '🎯 Objetivos da Lição',
      content: [
        'Identificar e usar corretamente os pronomes demonstrativos: this, that, these, those.',
        'Fazer e responder perguntas de posse com whose.',
        'Usar pronomes possessivos para indicar de quem é algo.',
      ],
    },
    {
      type: 'warmup',
      title: '🔥 Warm-Up – Olhe ao Redor',
      content: [
        'Aponte para os objetos perto de você e diga em voz alta:',
        '"This is a book."',
        '"That is a pen."',
        '"These are my keys."',
        '"Those are your shoes."',
        '',
        '👉 Use o que estiver perto e o que estiver longe.',
      ],
    },
    {
      type: 'vocabulary',
      title: '📖 Pronomes Demonstrativos',
      content: [
        { cells: ['Pronome', 'Significado', 'Uso', 'Exemplo'], isHeader: true },
        { cells: ['this', 'isto / este(a)', 'Singular, perto', 'This is my phone.'] },
        { cells: ['that', 'aquilo / aquele(a)', 'Singular, longe', 'That is your bag.'] },
        { cells: ['these', 'estes(as)', 'Plural, perto', 'These are my books.'] },
        { cells: ['those', 'aqueles(as)', 'Plural, longe', 'Those are his shoes.'] },
      ] as TableRow[],
    },
    {
      type: 'vocabulary',
      title: '📖 Pronomes Possessivos',
      content: [
        { cells: ['Pronome', 'Tradução', 'Exemplo'], isHeader: true },
        { cells: ['my', 'meu/minha', 'This is my notebook.'] },
        { cells: ['your', 'seu/sua (você)', 'That is your chair.'] },
        { cells: ['his', 'dele', 'This is his jacket.'] },
        { cells: ['her', 'dela', 'That is her pen.'] },
        { cells: ['its', 'dele/dela (neutro)', 'The dog is in its bed.'] },
        { cells: ['our', 'nosso(a)', 'These are our keys.'] },
        { cells: ['their', 'deles/delas', 'Those are their backpacks.'] },
      ] as TableRow[],
    },
    {
      type: 'vocabulary',
      title: '❓ Perguntando Sobre Posse – Whose...?',
      content: [
        { cells: ['Frase', 'Tradução'], isHeader: true },
        { cells: ['Whose book is this?', 'De quem é este livro?'] },
        { cells: ["It's my book.", 'É o meu livro.'] },
        { cells: ['Whose shoes are those?', 'De quem são aqueles sapatos?'] },
        { cells: ['They are his shoes.', 'São os sapatos dele.'] },
      ] as TableRow[],
    },
    {
      type: 'grammar',
      title: '🧠 Gramática em Ação',
      content: [
        'A. Demonstrativos + Substantivo:',
        'This is a pen.',
        'That is a computer.',
        'These are my glasses.',
        'Those are your notebooks.',
        '',
        'B. Possessivos + Substantivo:',
        'This is my friend.',
        'That is her bag.',
        'These are our books.',
        'Those are their kids.',
        '',
        'C. Whose...? para perguntar de quem é algo:',
        'Whose phone is this?',
        "It's his.",
        'Whose keys are those?',
        "They're mine.",
      ],
    },
    {
      type: 'dialogue',
      title: '🎭 Prática Oral – Role Play',
      content: [
        { speaker: '👩 A', text: 'Whose bag is this?' },
        { speaker: '👨 B', text: "It's my bag." },
        { speaker: '👩 A', text: 'And whose books are those?' },
        { speaker: '👨 B', text: "They're our books." },
      ] as DialogueLine[],
    },
    {
      type: 'practice',
      title: '🎨 Atividade Criativa – Invente uma Cena',
      content: [
        'Desenhe uma cena com 4 objetos próximos e 4 objetos distantes.',
        'Escreva frases com this / that / these / those e possessivos.',
        '',
        'Exemplo:',
        'This is my chair.',
        'That is his phone.',
        'These are our books.',
        'Those are their shoes.',
      ],
    },
    {
      type: 'practice',
      title: '🎯 Desafio Final',
      content: [
        'Complete com criatividade:',
        'This is _________________.',
        'That is _________________.',
        'These are _______________.',
        'Those are _______________.',
        'Whose ____________ is this?',
        "It's _________________.",
      ],
    },
    {
      type: 'text',
      title: '🏁 Conclusão',
      content: [
        'Agora você pode:',
        'Apontar objetos perto e longe com confiança.',
        'Falar de posse com clareza.',
        'Fazer perguntas com whose e responder corretamente.',
        '',
        'Continue praticando no seu dia a dia! Use "this" e "that" sempre que puder. A fluência vem com a repetição!',
      ],
    },
  ],
  exercises: [
    {
      id: 'licao-5-ex-a',
      title: 'A. Complete com this, that, these, those',
      type: 'fill',
      questions: [
        { id: 'l5a1', prompt: '___ is my house.', answer: 'This' },
        { id: 'l5a2', prompt: '___ are my brothers.', answer: 'These' },
        { id: 'l5a3', prompt: '___ is your car over there.', answer: 'That' },
        { id: 'l5a4', prompt: '___ are his pencils here.', answer: 'These' },
      ],
    },
    {
      id: 'licao-5-ex-b',
      title: 'B. Complete com my, your, his, her, our, their',
      type: 'fill',
      questions: [
        { id: 'l5b1', prompt: 'This is ___ book. (eu)', answer: 'my' },
        { id: 'l5b2', prompt: 'That is ___ dog. (ela)', answer: 'her' },
        { id: 'l5b3', prompt: 'These are ___ bags. (nós)', answer: 'our' },
        { id: 'l5b4', prompt: 'Those are ___ parents. (eles)', answer: 'their' },
        { id: 'l5b5', prompt: '___ name is John. (ele)', answer: 'His' },
      ],
    },
  ],
};

// ============================================================
// Lesson 6 – Aqui e Ali: Localização e Posição
// ============================================================

const licao6: Lesson = {
  id: 'licao-6',
  title: 'Aqui e Ali: Localização e Posição',
  icon: '🗺️',
  description: 'Use here/there e palavras de localização com confiança',
  sections: [
    {
      type: 'objective',
      title: '🎯 Objetivos da Lição',
      content: [
        'Entender o uso de here (aqui) e there (lá).',
        'Conhecer phrasal verbs básicos com here e there.',
        'Usar palavras para indicar localização e distância: next to, near, far, close.',
        'Praticar perguntas e respostas sobre onde algo ou alguém está.',
      ],
    },
    {
      type: 'warmup',
      title: '🔥 Warm-Up – Pergunte e Responda',
      content: [
        'Pergunte e responda em voz alta:',
        '',
        'Where are you?',
        "I'm here.",
        'Where is the book?',
        "It's there.",
      ],
    },
    {
      type: 'vocabulary',
      title: '📖 Vocabulário-Chave',
      content: [
        { cells: ['Palavra / Expressão', 'Significado', 'Exemplo'], isHeader: true },
        { cells: ['here', 'aqui', 'I am here.'] },
        { cells: ['there', 'lá, ali', 'The keys are there.'] },
        { cells: ['next to', 'ao lado de', 'The lamp is next to the bed.'] },
        { cells: ['near', 'perto de', 'The school is near my house.'] },
        { cells: ['far', 'longe', 'The supermarket is far from here.'] },
        { cells: ['close (to)', 'perto, próximo (de)', 'My office is close to the park.'] },
      ] as TableRow[],
    },
    {
      type: 'vocabulary',
      title: '🧩 Phrasal Verbs Simples',
      content: [
        { cells: ['Phrasal Verb', 'Significado', 'Exemplo'], isHeader: true },
        { cells: ['come here', 'venha aqui', 'Please come here!'] },
        { cells: ['go there', 'vá lá', 'Go there and wait for me.'] },
        { cells: ['put it there', 'coloque isso ali', 'Put it there, on the table.'] },
        { cells: ['stay here', 'fique aqui', 'Stay here until I come back.'] },
      ] as TableRow[],
    },
    {
      type: 'grammar',
      title: '🧠 Usando "Here" e "There"',
      content: [
        'Use here para falar de um lugar próximo de você:',
        'I live here.',
        'Come here!',
        '',
        'Use there para falar de um lugar mais longe:',
        'The bus stop is there.',
        'Look over there!',
      ],
    },
    {
      type: 'practice',
      title: '🎭 Prática Oral',
      content: [
        'Role-play com um parceiro ou sozinho:',
        '',
        'Pergunte onde algo está:',
        'Where is the book?',
        '',
        'Responda usando here, there, next to, near:',
        "It's here on the table.",
        "It's there next to the lamp.",
      ],
    },
    {
      type: 'practice',
      title: '🎨 Atividade Criativa',
      content: [
        'Desenhe um mapa simples do seu quarto ou da sala de aula.',
        'Escreva frases para descrever onde estão os objetos usando:',
        'here, there, next to, near, far, close to',
        'Use phrasal verbs como come here, put it there.',
      ],
    },
    {
      type: 'text',
      title: '🏁 Revisão Final',
      content: [
        'Here = perto de você, There = mais longe.',
        'Use next to para falar "ao lado de".',
        'Use near, close to para falar "perto de".',
        'Use far para falar "longe de".',
        'Phrasal verbs ajudam a dar instruções simples.',
      ],
    },
  ],
  exercises: [
    {
      id: 'licao-6-ex-a',
      title: 'A. Complete com here ou there',
      type: 'fill',
      questions: [
        { id: 'l6a1', prompt: "I'm ___ at home.", answer: 'here' },
        { id: 'l6a2', prompt: 'The store is ___ near the school.', answer: 'there' },
        { id: 'l6a3', prompt: 'Come ___, please!', answer: 'here' },
        { id: 'l6a4', prompt: 'The dog is ___ in the yard.', answer: 'there' },
      ],
    },
    {
      id: 'licao-6-ex-b',
      title: 'B. Complete com next to, near, far, close to',
      type: 'fill',
      questions: [
        { id: 'l6b1', prompt: 'The bank is ___ the post office.', answer: 'next to' },
        { id: 'l6b2', prompt: 'My house is ___ the school.', answer: 'near' },
        { id: 'l6b3', prompt: 'The beach is ___ from the city.', answer: 'far' },
        { id: 'l6b4', prompt: 'The café is ___ the library.', answer: 'close to' },
      ],
    },
    {
      id: 'licao-6-ex-c',
      title: 'C. Use os phrasal verbs para completar',
      type: 'choice',
      questions: [
        {
          id: 'l6c1',
          prompt: 'Please, ___ and help me.',
          answer: 'Come here',
          options: ['Come here', 'Go there'],
        },
        {
          id: 'l6c2',
          prompt: '___ until I finish.',
          answer: 'Stay here',
          options: ['Put it there', 'Stay here'],
        },
        {
          id: 'l6c3',
          prompt: "Can you ___ to see this?",
          answer: 'come here',
          options: ['come here', 'go there'],
        },
        {
          id: 'l6c4',
          prompt: "Don't leave! ___.",
          answer: 'Stay here',
          options: ['Stay here', 'Put it there'],
        },
      ],
    },
  ],
};

// ============================================================
// Lesson 8 – Verbo To Be no Passado: Como Era e Onde Estava?
// ============================================================

const licao8: Lesson = {
  id: 'licao-8',
  title: 'Verbo To Be no Passado: Como Era e Onde Estava?',
  icon: '⏰',
  description: 'Fale sobre pessoas, lugares e situações no passado com was/were',
  sections: [
    {
      type: 'objective',
      title: '🎯 Objetivos da Lição',
      content: [
        'Aprender a usar o verbo to be no passado: was e were.',
        'Fazer perguntas e respostas simples no passado.',
        'Falar sobre lugares, pessoas e situações no passado.',
      ],
    },
    {
      type: 'warmup',
      title: '🔥 Warm-Up – Revisão Rápida do Presente',
      content: [
        'I am / You are / He is / She is / We are / They are',
      ],
    },
    {
      type: 'vocabulary',
      title: '📖 Verbo To Be no Passado',
      content: [
        { cells: ['Pessoa', 'Presente', 'Passado', 'Tradução'], isHeader: true },
        { cells: ['I', 'am', 'was', 'Eu era / estava'] },
        { cells: ['You', 'are', 'were', 'Você era / estava'] },
        { cells: ['He', 'is', 'was', 'Ele era / estava'] },
        { cells: ['She', 'is', 'was', 'Ela era / estava'] },
        { cells: ['It', 'is', 'was', 'Isso era / estava'] },
        { cells: ['We', 'are', 'were', 'Nós éramos / estávamos'] },
        { cells: ['They', 'are', 'were', 'Eles eram / estavam'] },
      ] as TableRow[],
    },
    {
      type: 'grammar',
      title: '🧠 Como Usar?',
      content: [
        'Was para sujeito singular (I, he, she, it)',
        'Were para plural (you, we, they)',
      ],
    },
    {
      type: 'vocabulary',
      title: '✍️ Exemplos',
      content: [
        { cells: ['Inglês', 'Português'], isHeader: true },
        { cells: ['I was at home yesterday.', 'Eu estava em casa ontem.'] },
        { cells: ['She was happy last week.', 'Ela estava feliz semana passada.'] },
        { cells: ['They were at school this morning.', 'Eles estavam na escola esta manhã.'] },
        { cells: ['You were tired yesterday.', 'Você estava cansado ontem.'] },
      ] as TableRow[],
    },
    {
      type: 'vocabulary',
      title: '❓ Perguntas e Respostas no Passado',
      content: [
        { cells: ['Pergunta', 'Resposta'], isHeader: true },
        { cells: ['Were you at the party?', "Yes, I was. / No, I wasn't."] },
        { cells: ['Was he your friend?', "Yes, he was. / No, he wasn't."] },
        { cells: ['Were they in the park?', "Yes, they were. / No, they weren't."] },
      ] as TableRow[],
    },
    {
      type: 'practice',
      title: '🎭 Prática Oral – Conversa Simples',
      content: [
        'Pergunte e responda com seu colega ou sozinho:',
        'Were you at school yesterday?',
        "Yes, I was. / No, I wasn't.",
        'Was your friend happy last week?',
        "Yes, he was. / No, he wasn't.",
      ],
    },
    {
      type: 'practice',
      title: '🎨 Atividade de Escrita',
      content: [
        'Escreva 5 frases sobre você ou alguém, usando o verbo to be no passado.',
        '',
        'Exemplos:',
        'I was at the park yesterday.',
        'My parents were happy last year.',
        'She was sick last month.',
      ],
    },
    {
      type: 'tip',
      title: '🧠 Dica para Falantes de Português',
      content: 'No português, o verbo "ser" e "estar" são usados no passado, mas em inglês usamos só o verbo to be no passado para ambos os casos. Exemplo: "Eu era feliz" / "Eu estava feliz" = I was happy.',
    },
    {
      type: 'text',
      title: '🏁 Conclusão',
      content: 'Agora você sabe falar sobre pessoas, lugares e sentimentos no passado! Continue praticando para entender melhor as diferenças entre presente e passado no inglês.',
    },
  ],
  exercises: [
    {
      id: 'licao-8-ex-a',
      title: 'A. Complete com was ou were',
      type: 'fill',
      questions: [
        { id: 'l8a1', prompt: 'I ___ at the library yesterday.', answer: 'was' },
        { id: 'l8a2', prompt: 'They ___ at home last night.', answer: 'were' },
        { id: 'l8a3', prompt: 'She ___ very tired last week.', answer: 'was' },
        { id: 'l8a4', prompt: 'You ___ at the concert on Friday.', answer: 'were' },
        { id: 'l8a5', prompt: 'We ___ happy with the test results.', answer: 'were' },
      ],
    },
    {
      id: 'licao-8-ex-b',
      title: 'B. Faça perguntas com was ou were para estas frases',
      type: 'fill',
      questions: [
        { id: 'l8b1', prompt: 'They were at school. → ___ they at school?', answer: 'Were' },
        { id: 'l8b2', prompt: 'He was late. → ___ he late?', answer: 'Was' },
        { id: 'l8b3', prompt: 'You were busy. → ___ you busy?', answer: 'Were' },
      ],
    },
  ],
};

// ============================================================
// Lesson 9 – Revisão Completa: Tudo que Aprendemos Até Aqui!
// ============================================================

const licao9: Lesson = {
  id: 'licao-9',
  title: 'Revisão Completa: Tudo que Aprendemos Até Aqui!',
  icon: '📚',
  description: 'Revisão completa de tudo que aprendeu até aqui',
  sections: [
    {
      type: 'objective',
      title: '🎯 Objetivos da Lição',
      content: [
        'Revisar todas as estruturas e vocabulário das lições anteriores.',
        'Praticar o verbo to be no presente e no passado.',
        'Relembrar preposições, pronomes demonstrativos, possessivos, whose, here/there.',
        'Consolidar o aprendizado com uma história prática, exercícios e frases reais.',
      ],
    },
    {
      type: 'vocabulary',
      title: '📚 Relembrando os Principais Conceitos',
      content: [
        { cells: ['Tema', 'Explicação Rápida', 'Exemplo'], isHeader: true },
        { cells: ['Saudações e Apresentações', 'Usar "Hello", "Hi", "My name is..."', 'Hello! My name is Ana.'] },
        { cells: ['Verbo to be (presente)', 'I am, you are, he/she is', 'I am happy. You are my friend.'] },
        { cells: ['Vocabulário básico de descrição', 'Adjetivos, advérbios, substantivos', 'She is strong. I speak slowly.'] },
        { cells: ['Preposições', 'in, on, at, by, with, of, under, next to', 'The book is on the table.'] },
        { cells: ['Pronomes demonstrativos', 'this, that, these, those', 'This is my pen. Those are her shoes.'] },
        { cells: ['Pronomes possessivos e perguntas', 'my, your, his, her, our, their; whose...?', 'Whose bag is this? It\'s mine.'] },
        { cells: ['Here and There', 'here = perto, there = longe', 'I live here. The school is there.'] },
        { cells: ['Verbo to be no passado', 'was (singular), were (plural)', 'I was at home. They were at school.'] },
      ] as TableRow[],
    },
    {
      type: 'text',
      title: '📖 História: Um Dia com Ana e Ben',
      content: [
        'Ana and Ben are friends. Today, Ana is at home. She is happy because she has a day off. Ben is at school, but he was tired yesterday.',
      ],
    },
    {
      type: 'dialogue',
      title: '📖 História: Um Dia com Ana e Ben (Diálogo)',
      content: [
        { speaker: 'Ana', text: 'Hello, Ben! Where were you yesterday?' },
        { speaker: 'Ben', text: 'I was at the park with my family. We were very tired after the walk.' },
        { speaker: 'Ana', text: 'This is my phone. Whose phone is that?' },
        { speaker: 'Ben', text: 'That is my phone. It was in my bag.' },
        { speaker: 'Ana', text: 'The keys are on the table, and the book is under the chair.' },
        { speaker: 'Ben', text: 'Yes, I always put things there and lose them!' },
        { speaker: 'Ana', text: "Let's meet here tomorrow. Are you coming by bus?" },
        { speaker: 'Ben', text: "Yes, I'll come by bus. See you there!" },
      ] as DialogueLine[],
    },
    {
      type: 'vocabulary',
      title: '📖 Glossário (Palavras e expressões importantes)',
      content: [
        { cells: ['Palavra / Expressão', 'Tradução', 'Explicação Simples'], isHeader: true },
        { cells: ['was / were', 'era / estava', 'Passado do verbo to be. "Was" para singular (I, he, she, it), "were" para plural (you, we, they). Ex.: I was tired. They were happy.'] },
        { cells: ['day off', 'folga', 'Dia sem trabalho ou escola. Ex.: I have a day off tomorrow.'] },
        { cells: ['where were you?', 'onde você estava?', 'Pergunta no passado usando verbo to be. Ex.: Where were you yesterday?'] },
        { cells: ['whose', 'de quem', 'Pergunta para saber a quem pertence algo. Ex.: Whose book is this?'] },
        { cells: ['on the table', 'em cima da mesa', 'Preposição indicando lugar. Ex.: The keys are on the table.'] },
        { cells: ['under the chair', 'embaixo da cadeira', 'Preposição indicando lugar. Ex.: The book is under the chair.'] },
        { cells: ['by bus', 'de ônibus', 'Preposição para modo de transporte. Ex.: I go to school by bus.'] },
        { cells: ['there', 'lá, ali', 'Lugar longe do falante. Ex.: The school is there.'] },
        { cells: ['here', 'aqui', 'Lugar perto do falante. Ex.: I live here.'] },
        { cells: ['happy', 'feliz', 'Sentimento positivo. Ex.: She is happy today.'] },
        { cells: ['tired', 'cansado(a)', 'Sentimento de cansaço. Ex.: He was tired yesterday.'] },
        { cells: ['friend', 'amigo(a)', 'Pessoa que você conhece e gosta. Ex.: Ben is my friend.'] },
        { cells: ['keys', 'chaves', 'Objetos para abrir portas. Ex.: Where are my keys?'] },
        { cells: ['phone', 'telefone', 'Aparelho para falar com outras pessoas. Ex.: This is my phone.'] },
        { cells: ['book', 'livro', 'Objeto para leitura. Ex.: I am reading a book.'] },
      ] as TableRow[],
    },
    {
      type: 'text',
      title: '💬 Frases Práticas para o Dia a Dia',
      content: [
        'Hello! My name is [Name]. What\'s your name?',
        "I'm from Brazil. Where are you from?",
        'This is my book. Whose book is that?',
        'The phone is on the table.',
        'I was at home yesterday. Were you at school?',
        'Come here! The keys are under the chair.',
        "I'm with my friend. We went to the park by bus.",
      ],
    },
    {
      type: 'text',
      title: '🏁 Finalização',
      content: 'Parabéns! Você revisou e praticou os conteúdos essenciais das lições anteriores. Use essas frases e estruturas em conversas reais para ganhar confiança.',
    },
  ],
  exercises: [
    {
      id: 'licao-9-ex-1',
      title: '1. Complete com am / is / are (presente)',
      type: 'fill',
      questions: [
        { id: 'l9e1a', prompt: 'I ___ happy.', answer: 'am' },
        { id: 'l9e1b', prompt: 'She ___ my friend.', answer: 'is' },
        { id: 'l9e1c', prompt: 'They ___ at school.', answer: 'are' },
      ],
    },
    {
      id: 'licao-9-ex-2',
      title: '2. Complete com was / were (passado)',
      type: 'fill',
      questions: [
        { id: 'l9e2a', prompt: 'He ___ tired yesterday.', answer: 'was' },
        { id: 'l9e2b', prompt: 'We ___ at the park last weekend.', answer: 'were' },
        { id: 'l9e2c', prompt: 'You ___ at the party on Saturday.', answer: 'were' },
      ],
    },
    {
      id: 'licao-9-ex-3',
      title: '3. Complete com preposições (in, on, at, by, with, under, next to)',
      type: 'fill',
      questions: [
        { id: 'l9e3a', prompt: 'The keys are ___ the table.', answer: 'on' },
        { id: 'l9e3b', prompt: 'I go to school ___ bus.', answer: 'by' },
        { id: 'l9e3c', prompt: 'She is ___ the park ___ her dog.', answer: 'in / with' },
      ],
    },
    {
      id: 'licao-9-ex-4',
      title: '4. Escolha o demonstrativo correto (this, that, these, those)',
      type: 'choice',
      questions: [
        {
          id: 'l9e4a',
          prompt: '___ is my phone. (perto)',
          answer: 'This',
          options: ['This', 'That', 'These', 'Those'],
        },
        {
          id: 'l9e4b',
          prompt: '___ are your books. (longe)',
          answer: 'Those',
          options: ['This', 'That', 'These', 'Those'],
        },
        {
          id: 'l9e4c',
          prompt: '___ is his jacket. (longe)',
          answer: 'That',
          options: ['This', 'That', 'These', 'Those'],
        },
        {
          id: 'l9e4d',
          prompt: '___ are my friends. (perto)',
          answer: 'These',
          options: ['This', 'That', 'These', 'Those'],
        },
      ],
    },
    {
      id: 'licao-9-ex-5',
      title: '5. Complete com pronomes possessivos (my, your, his, her, our, their)',
      type: 'fill',
      questions: [
        { id: 'l9e5a', prompt: 'This is ___ book. (eu)', answer: 'my' },
        { id: 'l9e5b', prompt: 'That is ___ car. (ela)', answer: 'her' },
        { id: 'l9e5c', prompt: 'Those are ___ keys. (eles)', answer: 'their' },
        { id: 'l9e5d', prompt: 'These are ___ parents. (nós)', answer: 'our' },
      ],
    },
    {
      id: 'licao-9-ex-6',
      title: '6. Perguntas com whose',
      type: 'fill',
      questions: [
        { id: 'l9e6a', prompt: "It's her bag. → ___?", answer: 'Whose bag is this?' },
        { id: 'l9e6b', prompt: "They're his shoes. → ___?", answer: 'Whose shoes are these?' },
      ],
    },
    {
      id: 'licao-9-ex-7',
      title: '7. Traduza para o inglês (frases reais)',
      type: 'translate',
      questions: [
        { id: 'l9e7a', prompt: 'Onde você estava ontem?', answer: 'Where were you yesterday?' },
        { id: 'l9e7b', prompt: 'Eu estava na escola.', answer: 'I was at school.' },
        { id: 'l9e7c', prompt: 'Este é o meu telefone.', answer: 'This is my phone.' },
        { id: 'l9e7d', prompt: 'Aqueles são nossos amigos.', answer: 'Those are our friends.' },
        { id: 'l9e7e', prompt: 'Ela estava cansada ontem.', answer: 'She was tired yesterday.' },
      ],
    },
  ],
};

// ============================================================
// Lesson 10 – Verbos Essenciais, Perguntas com DO/DOES, e o Uso de TO e FOR
// ============================================================

const licao10: Lesson = {
  id: 'licao-10',
  title: 'Verbos Essenciais, Perguntas com DO/DOES, e o Uso de TO e FOR',
  icon: '🧩',
  description: 'Verbos essenciais do cotidiano, perguntas com DO/DOES e a diferença entre TO e FOR',
  sections: [
    {
      type: 'objective',
      title: '🎯 Objetivos da Lição',
      content: [
        'Aprender os verbos mais comuns em inglês para o cotidiano',
        'Saber como fazer perguntas com Do e Does',
        'Entender o uso correto de To e For',
        'Usar frases reais e aplicáveis no dia a dia',
        'Praticar com exercícios variados e criativos',
      ],
    },
    {
      type: 'vocabulary',
      title: '🧠 Verbos Essenciais do Cotidiano',
      content: [
        { cells: ['Verbo', 'Tradução', 'Exemplo'], isHeader: true },
        { cells: ['go', 'ir', 'I go to school.'] },
        { cells: ['eat', 'comer', 'They eat pizza.'] },
        { cells: ['like', 'gostar', 'She likes music.'] },
        { cells: ['want', 'querer', 'We want coffee.'] },
        { cells: ['need', 'precisar', 'I need help.'] },
        { cells: ['have', 'ter', 'You have two brothers.'] },
        { cells: ['make', 'fazer', 'He makes dinner.'] },
        { cells: ['take', 'pegar/levar', 'They take the bus.'] },
        { cells: ['give', 'dar', 'I give you my number.'] },
        { cells: ['get', 'obter/pegar', 'He gets home at 7.'] },
        { cells: ['know', 'saber/conhecer', 'I know this song.'] },
      ] as TableRow[],
    },
    {
      type: 'tip',
      title: '👀 Observações',
      content: 'Verbos como like, want, need são frequentemente seguidos de outro verbo com "to". Ex: I want to go. She needs to eat.',
    },
    {
      type: 'grammar',
      title: '❓ Como fazer perguntas com DO e DOES',
      content: [
        'Regras Básicas:',
        'I / You / We / They → DO → Do you like apples?',
        'He / She / It → DOES → Does he work here?',
        '',
        'Estrutura da pergunta:',
        'Do/Does + sujeito + verbo principal + complemento?',
        '',
        'Do they live in Brazil?',
        'Does she want tea?',
        '',
        'Importante: O verbo principal não muda com DO/DOES:',
        'Correto: Does he like coffee?',
        'Errado: ❌ Does he likes coffee?',
        '',
        'Respostas curtas:',
        "Yes, I do. / No, I don't.",
        "Yes, she does. / No, she doesn't.",
      ],
    },
    {
      type: 'grammar',
      title: '📍 TO e FOR: quando usar e por quê?',
      content: [
        'TO = direção, destino, objetivo:',
        'I go to school.',
        'She gave the book to her friend.',
        'He wants to travel.',
        '',
        'FOR = benefício, propósito, substituição:',
        'This gift is for you.',
        'I work for my family.',
        'I will cook dinner for us.',
      ],
    },
    {
      type: 'vocabulary',
      title: '🔄 Comparação rápida: TO vs FOR',
      content: [
        { cells: ['Exemplo', 'Tradução', 'Explicação'], isHeader: true },
        { cells: ['I give the book to John.', 'Eu dou o livro para o John.', 'Foco na entrega (movimento/destino).'] },
        { cells: ['I bought a gift for Ana.', 'Eu comprei um presente para a Ana.', 'Foco no benefício (intenção).'] },
      ] as TableRow[],
    },
    {
      type: 'dialogue',
      title: '👫 Diálogo 1',
      content: [
        { speaker: 'Sofia', text: 'Do you like coffee?' },
        { speaker: 'Lucas', text: 'Yes, I do! I drink it every morning.' },
        { speaker: 'Sofia', text: 'I want to make some. Do you need sugar?' },
        { speaker: 'Lucas', text: 'No, thanks. Just milk.' },
      ] as DialogueLine[],
    },
    {
      type: 'dialogue',
      title: '🚶 Diálogo 2',
      content: [
        { speaker: 'Mia', text: 'Where do you go every day?' },
        { speaker: 'Tom', text: 'I go to work. It\'s far, but I take the bus.' },
        { speaker: 'Mia', text: 'I made lunch for you.' },
        { speaker: 'Tom', text: 'Thank you! You always cook for me.' },
      ] as DialogueLine[],
    },
    {
      type: 'text',
      title: '📚 Mini Texto: Real Life',
      content: [
        'My Day',
        '',
        'Hi, my name is Mark. I live in New York. I work from Monday to Friday. Every morning, I go to work at 8 am. I usually eat a sandwich for breakfast. I like coffee, but I don\'t drink it every day. I talk to my friends, and sometimes I help them. On weekends, I make lunch for my family. I love to cook for them. I also go to the park. My life is simple, but I like it.',
      ],
    },
    {
      type: 'vocabulary',
      title: '🧾 Glossário da Lição 10',
      content: [
        { cells: ['Palavra/Expressão', 'Significado'], isHeader: true },
        { cells: ['go', 'ir'] },
        { cells: ['eat', 'comer'] },
        { cells: ['like', 'gostar'] },
        { cells: ['want', 'querer'] },
        { cells: ['need', 'precisar'] },
        { cells: ['make', 'fazer/preparar'] },
        { cells: ['take', 'pegar/levar'] },
        { cells: ['give', 'dar'] },
        { cells: ['get', 'obter/chegar'] },
        { cells: ['know', 'saber/conhecer'] },
        { cells: ['do/does', 'auxiliares para perguntas'] },
        { cells: ['to', 'direção, objetivo'] },
        { cells: ['for', 'benefício, intenção'] },
        { cells: ['help', 'ajudar'] },
        { cells: ['talk', 'conversar'] },
      ] as TableRow[],
    },
    {
      type: 'text',
      title: '✅ Resumo Final',
      content: [
        'Você aprendeu 10+ verbos essenciais do cotidiano.',
        'Entendeu como fazer perguntas com DO e DOES.',
        'Conheceu a diferença entre TO e FOR com vários exemplos.',
        'Praticou com atividades e diálogos da vida real.',
        'Está mais preparado para usar o inglês com confiança em situações reais!',
      ],
    },
  ],
  exercises: [
    {
      id: 'licao-10-ex-1',
      title: 'Atividade 1: Complete as frases com DO ou DOES',
      type: 'fill',
      questions: [
        { id: 'l10e1a', prompt: '______ you work on weekends?', answer: 'Do' },
        { id: 'l10e1b', prompt: '______ she like cats?', answer: 'Does' },
        { id: 'l10e1c', prompt: 'What time ______ they go home?', answer: 'do' },
        { id: 'l10e1d', prompt: '______ he have a car?', answer: 'Does' },
      ],
    },
    {
      id: 'licao-10-ex-2',
      title: 'Atividade 2: Responda com Yes/No + frase completa',
      type: 'fill',
      questions: [
        { id: 'l10e2a', prompt: 'Do you want water?', answer: 'Yes, I do.' },
        { id: 'l10e2b', prompt: 'Does your friend play soccer?', answer: 'Yes, he does.' },
      ],
    },
    {
      id: 'licao-10-ex-3',
      title: 'Atividade 3: Complete com TO ou FOR',
      type: 'fill',
      questions: [
        { id: 'l10e3a', prompt: 'She gives flowers ___ her mother.', answer: 'to' },
        { id: 'l10e3b', prompt: 'I go ___ the gym at 8 am.', answer: 'to' },
        { id: 'l10e3c', prompt: 'This message is ___ you.', answer: 'for' },
        { id: 'l10e3d', prompt: 'I need ___ talk to you.', answer: 'to' },
      ],
    },
    {
      id: 'licao-10-ex-4',
      title: 'Atividade 4: Traduza para o inglês',
      type: 'translate',
      questions: [
        { id: 'l10e4a', prompt: 'Eu gosto de música.', answer: 'I like music.' },
        { id: 'l10e4b', prompt: 'Você quer café?', answer: 'Do you want coffee?' },
        { id: 'l10e4c', prompt: 'Ele precisa de ajuda.', answer: 'He needs help.' },
        { id: 'l10e4d', prompt: 'Este presente é para você.', answer: 'This gift is for you.' },
      ],
    },
    {
      id: 'licao-10-ex-5',
      title: 'Atividade 5: Organize a pergunta',
      type: 'match',
      questions: [
        { id: 'l10e5a', prompt: 'work / do / where / you / ?', answer: 'Where do you work?' },
        { id: 'l10e5b', prompt: 'want / she / what / does / ?', answer: 'What does she want?' },
      ],
    },
    {
      id: 'licao-10-ex-6',
      title: 'Atividade 6: Complete com um verbo do quadro',
      type: 'choice',
      questions: [
        {
          id: 'l10e6a',
          prompt: 'I _______ to the park on Sundays. (eat – go – need – know – like)',
          answer: 'go',
          options: ['eat', 'go', 'need', 'know', 'like'],
        },
        {
          id: 'l10e6b',
          prompt: 'They _______ pasta and rice. (eat – go – need – know – like)',
          answer: 'eat',
          options: ['eat', 'go', 'need', 'know', 'like'],
        },
        {
          id: 'l10e6c',
          prompt: "She doesn't _______ him. (eat – go – need – know – like)",
          answer: 'know',
          options: ['eat', 'go', 'need', 'know', 'like'],
        },
        {
          id: 'l10e6d',
          prompt: 'We _______ your help. (eat – go – need – know – like)',
          answer: 'need',
          options: ['eat', 'go', 'need', 'know', 'like'],
        },
        {
          id: 'l10e6e',
          prompt: 'Do you _______ pizza? (eat – go – need – know – like)',
          answer: 'like',
          options: ['eat', 'go', 'need', 'know', 'like'],
        },
      ],
    },
  ],
};

// ============================================================
// Export all lessons
// ============================================================

export const LESSONS: Lesson[] = [
  licao2,
  licao3,
  licao4,
  licao5,
  licao6,
  licao8,
  licao9,
  licao10,
];