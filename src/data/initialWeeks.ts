import { WeekPlan, DayPlan } from '../types';

export const INITIAL_WEEKS: WeekPlan[] = [
  {
    id: 'semana-1',
    weekNumber: 1,
    title: 'Semana 1: Fundamentos Jurídicos e Raciocínio Base',
    description: 'Introdução aos pilares constitucionais, gramática essencial e raciocínio lógico.',
    access: 'ALL',
    allowedEmails: [],
    days: [
      {
        day: 'Segunda-feira',
        shortDay: 'SEG',
        dateLabel: 'Dia 01',
        b1: {
          sub: 'Direito Constitucional',
          title: 'Princípios Fundamentais da CF/88',
          idx: 1,
          videoUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
          t1: 'Fundamentos e Objetivos da República (Arts. 1º a 3º)',
          t2: 'Princípios das Relações Internacionais (Art. 4º)',
          t3: 'Mnemônicos clássicos e resolução comentada',
          durationMin: 60,
          type: 'theory'
        },
        b2: {
          sub: 'Língua Portuguesa',
          title: 'Morfologia: Classes de Palavras & Substantivos',
          idx: 1,
          videoUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
          t1: 'Processo de Formação de Palavras',
          t2: 'Flexão de Gênero, Número e Grau',
          durationMin: 50,
          type: 'theory'
        },
        b3: {
          sub: 'Bateria de Questões',
          title: '30 Questões CEBRASPE / FGV (CF + Português)',
          idx: 'P1',
          t1: '15Q CF/88 Art. 1º a 4º',
          t2: '15Q Morfologia e Vocabulário',
          durationMin: 45,
          type: 'practice'
        }
      },
      {
        day: 'Terça-feira',
        shortDay: 'TER',
        dateLabel: 'Dia 02',
        b1: {
          sub: 'Direito Administrativo',
          title: 'Regime Jurídico-Administrativo e Princípios',
          idx: 1,
          videoUrl: 'https://www.youtube.com/watch?v=kxy6vmsx2cI',
          t1: 'Supremacia e Indisponibilidade do Interesse Público',
          t2: 'Princípios Expressos (LIMPE) e Implícitos',
          durationMin: 60,
          type: 'theory'
        },
        b2: {
          sub: 'Raciocínio Lógico',
          title: 'Lógica Proposicional: Conectivos e Tabelas-Verdade',
          idx: 1,
          videoUrl: 'https://www.youtube.com/watch?v=9jK-NcRmVcw',
          t1: 'Conjunção, Disjunção e Condicional',
          t2: 'Tabela-verdade da Bicondicional e Negação',
          durationMin: 55,
          type: 'theory'
        },
        b3: {
          sub: 'Caderno de Erros',
          title: 'Fixação & Resolução Guiada de Proposições',
          idx: 'P2',
          t1: 'Montagem de Tabela-Verdade rápida',
          t2: 'Pegadinhas clássicas da condicional (Se... então)',
          durationMin: 40,
          type: 'practice'
        }
      },
      {
        day: 'Quarta-feira',
        shortDay: 'QUA',
        dateLabel: 'Dia 03',
        b1: {
          sub: 'Direito Constitucional',
          title: 'Direitos e Deveres Individuais e Coletivos (Art. 5º)',
          idx: 2,
          videoUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
          t1: 'Direito à Vida, Igualdade e Liberdade',
          t2: 'Inviolabilidade de Domicílio e Sigilos',
          durationMin: 70,
          type: 'theory'
        },
        b2: {
          sub: 'Direito Penal',
          title: 'Aplicação da Lei Penal no Tempo e no Espaço',
          idx: 1,
          videoUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
          t1: 'Princípio da Legalidade e Anterioridade',
          t2: 'Luta (Lugar da Ubiquidade / Tempo da Atividade)',
          durationMin: 50,
          type: 'theory'
        },
        b3: {
          sub: 'Bateria de Questões',
          title: '25 Questões Art. 5º CF + Teoria do Crime',
          idx: 'P3',
          t1: 'Jurisprudência STF/STJ sobre Domicílio',
          t2: 'Retroatividade da Lei Penal Mais Benéfica',
          durationMin: 45,
          type: 'practice'
        }
      },
      {
        day: 'Quinta-feira',
        shortDay: 'QUI',
        dateLabel: 'Dia 04',
        b1: {
          sub: 'Língua Portuguesa',
          title: 'Sintaxe do Período Simples: Termos da Oração',
          idx: 2,
          videoUrl: 'https://www.youtube.com/watch?v=9jK-NcRmVcw',
          t1: 'Sujeito, Predicado e Transitividade Verbal',
          t2: 'Complementos Verbais e Agente da Passiva',
          durationMin: 60,
          type: 'theory'
        },
        b2: {
          sub: 'Informática',
          title: 'Segurança da Informação & Malwares',
          idx: 1,
          videoUrl: 'https://www.youtube.com/watch?v=kxy6vmsx2cI',
          t1: 'Vírus, Worms, Ransomware e Spywares',
          t2: 'Assinatura Digital, Certificação ICP-Brasil',
          durationMin: 50,
          type: 'theory'
        },
        b3: {
          sub: 'Prática de Questões',
          title: '30 Questões Termos da Oração & Malwares',
          idx: 'P4',
          t1: 'Diferença entre Complemento Nominal e Adj. Adnominal',
          t2: 'Tipos de Criptografia: Simétrica vs Assimétrica',
          durationMin: 45,
          type: 'practice'
        }
      },
      {
        day: 'Sexta-feira',
        shortDay: 'SEX',
        dateLabel: 'Dia 05',
        b1: {
          sub: 'Direito Administrativo',
          title: 'Organização da Administração Pública',
          idx: 2,
          videoUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
          t1: 'Administração Direta vs Indireta',
          t2: 'Autarquias, Fundações, Empresas Públicas e SEM',
          durationMin: 60,
          type: 'theory'
        },
        b2: {
          sub: 'Raciocínio Lógico',
          title: 'Equivalências Lógicas e Negações de Proposições',
          idx: 2,
          videoUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
          t1: 'Leis de De Morgan: Negação de E / OU',
          t2: 'Contrapositiva e Equivalência da Condicional',
          durationMin: 55,
          type: 'theory'
        },
        b3: {
          sub: 'Revisão Semanal',
          title: 'Flashcards e Mapas Mentais da Semana 1',
          idx: 'R1',
          t1: 'Revisão ativa dos 10 tópicos estudados',
          t2: 'Anotações nos cadernos de resumo',
          durationMin: 50,
          type: 'review'
        }
      },
      {
        day: 'Sábado',
        shortDay: 'SÁB',
        dateLabel: 'Dia 06',
        b1: {
          sub: 'Simulado Semanal',
          title: 'Simulado Cronometrado 60 Questões (Semana 1)',
          idx: 'SIM-1',
          videoUrl: 'https://www.youtube.com/watch?v=9jK-NcRmVcw',
          t1: '20Q Português, 15Q RLM, 15Q Direito Const., 10Q Adm.',
          t2: 'Ambiente de prova real: 2h30 sem interrupções',
          durationMin: 150,
          type: 'practice'
        },
        b2: {
          sub: 'Redação Discursiva',
          title: 'Laboratório de Redação: Estrutura Dissertativa',
          idx: 1,
          videoUrl: 'https://www.youtube.com/watch?v=kxy6vmsx2cI',
          t1: 'Tema: O Papel da Cidadania na Ordem Constitucional',
          t2: 'Estruturação: Tese, D1, D2 e Proposta de Solução',
          durationMin: 60,
          type: 'theory'
        },
        b3: {
          sub: 'Análise de Desempenho',
          title: 'Correção Comentada e Caderno de Erros do Simulado',
          idx: 'P5',
          t1: 'Mapeamento das matérias com índice < 75%',
          t2: 'Alinhamento de metas para a Semana 2',
          durationMin: 45,
          type: 'review'
        }
      }
    ]
  },
  {
    id: 'semana-2',
    weekNumber: 2,
    title: 'Semana 2: Aprofundamento e Direitos Sociais',
    description: 'Direitos fundamentais avançados, atos administrativos e pontuação aplicada.',
    access: 'ALL',
    allowedEmails: [],
    days: [
      {
        day: 'Segunda-feira',
        shortDay: 'SEG',
        dateLabel: 'Dia 07',
        b1: {
          sub: 'Direito Constitucional',
          title: 'Remédios Constitucionais e Direitos Sociais',
          idx: 3,
          videoUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
          t1: 'Habeas Corpus, Mandado de Segurança, HD, MI e Ação Popular',
          t2: 'Direitos dos Trabalhadores e Seguridade Social (Art. 7º ao 11)',
          durationMin: 60,
          type: 'theory'
        },
        b2: {
          sub: 'Língua Portuguesa',
          title: 'Pontuação: A Vírgula e Seus Casos Proibidos',
          idx: 3,
          videoUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
          t1: 'Vírgula no Período Simples (Não separar Sujeito e Predicado)',
          t2: 'Vírgula no Período Composto e Orações Adjetivas',
          durationMin: 55,
          type: 'theory'
        },
        b3: {
          sub: 'Bateria de Questões',
          title: '30 Questões Remédios Constitucionais + Pontuação',
          idx: 'P6',
          t1: 'Distinção prática MS Individual vs Coletivo',
          t2: 'Casos facultativos de vírgula',
          durationMin: 45,
          type: 'practice'
        }
      },
      {
        day: 'Terça-feira',
        shortDay: 'TER',
        dateLabel: 'Dia 08',
        b1: {
          sub: 'Direito Administrativo',
          title: 'Atos Administrativos: Conceito e Requisitos',
          idx: 3,
          videoUrl: 'https://www.youtube.com/watch?v=kxy6vmsx2cI',
          t1: 'Requisitos/Elementos: CO-FI-FO-MO-OB',
          t2: 'Competência, Finalidade, Forma, Motivo e Objeto',
          durationMin: 65,
          type: 'theory'
        },
        b2: {
          sub: 'Raciocínio Lógico',
          title: 'Diagramas Lógicos e Quantificadores (Todo, Algum, Nenhum)',
          idx: 3,
          videoUrl: 'https://www.youtube.com/watch?v=9jK-NcRmVcw',
          t1: 'Negação de Proposições Categóricas (PEA + NÃO)',
          t2: 'Silogismos e Validade de Argumentos',
          durationMin: 55,
          type: 'theory'
        },
        b3: {
          sub: 'Prática Dirigida',
          title: 'Resolução Comentada de 25 Questões FGV/CEBRASPE',
          idx: 'P7',
          t1: 'Atributos do Ato (PATI) vs Requisitos (COMFIFOMOB)',
          durationMin: 40,
          type: 'practice'
        }
      },
      {
        day: 'Quarta-feira',
        shortDay: 'QUA',
        dateLabel: 'Dia 09',
        b1: {
          sub: 'Direito Penal',
          title: 'Teoria Geral do Delito: Fato Típico',
          idx: 2,
          videoUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
          t1: 'Conduta, Resultado, Nexo Causal e Tipicidade',
          t2: 'Dolo, Culpa e Preterdolo',
          durationMin: 60,
          type: 'theory'
        },
        b2: {
          sub: 'Informática',
          title: 'Redes de Computadores e Protocolos de Internet',
          idx: 2,
          videoUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
          t1: 'Modelo TCP/IP e Portas Padrão (HTTP, HTTPS, SSH, DNS)',
          t2: 'IPv4 vs IPv6 e Endereçamento de Rede',
          durationMin: 50,
          type: 'theory'
        },
        b3: {
          sub: 'Bateria de Questões',
          title: '30 Questões Fato Típico + Redes',
          idx: 'P8',
          durationMin: 45,
          type: 'practice'
        }
      },
      {
        day: 'Quinta-feira',
        shortDay: 'QUI',
        dateLabel: 'Dia 10',
        b1: {
          sub: 'Língua Portuguesa',
          title: 'Crase: Regras Gerais, Casos Proibidos e Facultativos',
          idx: 4,
          videoUrl: 'https://www.youtube.com/watch?v=kxy6vmsx2cI',
          t1: 'Fusão da preposição A com artigo A',
          t2: 'Crase antes de pronomes e nomes de cidades',
          durationMin: 60,
          type: 'theory'
        },
        b2: {
          sub: 'Direito Constitucional',
          title: 'Nacionalidade e Direitos Políticos',
          idx: 4,
          videoUrl: 'https://www.youtube.com/watch?v=9jK-NcRmVcw',
          t1: 'Brasileiros Natos vs Naturalizados (Cargos privativos)',
          t2: 'Condições de Elegibilidade e Inelegibilidades',
          durationMin: 55,
          type: 'theory'
        },
        b3: {
          sub: 'Prática de Questões',
          title: '25 Questões Crase e Nacionalidade',
          idx: 'P9',
          durationMin: 40,
          type: 'practice'
        }
      },
      {
        day: 'Sexta-feira',
        shortDay: 'SEX',
        dateLabel: 'Dia 11',
        b1: {
          sub: 'Direito Administrativo',
          title: 'Atributos do Ato Administrativo e Extinção',
          idx: 4,
          videoUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
          t1: 'Presunção de Legitimidade, Autoexecutoriedade, Tipicidade e Imperatividade',
          t2: 'Anulação (Ilegalidade) vs Revogação (Conveniência e Oportunidade)',
          durationMin: 60,
          type: 'theory'
        },
        b2: {
          sub: 'Raciocínio Lógico',
          title: 'Análise Combinatória: Princípio Fundamental da Contagem',
          idx: 4,
          videoUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
          t1: 'Arranjos, Combinações e Permutações Simples',
          t2: 'Quando a ordem dos elementos importa',
          durationMin: 60,
          type: 'theory'
        },
        b3: {
          sub: 'Revisão Ativa',
          title: 'Síntese da Semana 2 e Mapas Mentais',
          idx: 'R2',
          durationMin: 45,
          type: 'review'
        }
      },
      {
        day: 'Sábado',
        shortDay: 'SÁB',
        dateLabel: 'Dia 12',
        b1: {
          sub: 'Simulado Semanal',
          title: 'Simulado Semanal 60 Questões (Semana 1 + 2 Acumuladas)',
          idx: 'SIM-2',
          videoUrl: 'https://www.youtube.com/watch?v=9jK-NcRmVcw',
          t1: 'Revisão espaçada de tópicos das duas primeiras semanas',
          durationMin: 150,
          type: 'practice'
        },
        b2: {
          sub: 'Redação Discursiva',
          title: 'Elaboração de Estudo de Caso / Discursiva Jurídica',
          idx: 2,
          videoUrl: 'https://www.youtube.com/watch?v=kxy6vmsx2cI',
          t1: 'Análise de caso prático de Ato Ilegal e Ação Popular',
          durationMin: 60,
          type: 'theory'
        },
        b3: {
          sub: 'Caderno de Erros',
          title: 'Catalogação de Dúvidas e Erros Recorrentes',
          idx: 'P10',
          durationMin: 45,
          type: 'review'
        }
      }
    ]
  },
  {
    id: 'semana-3',
    weekNumber: 3,
    title: 'Semana 3: Módulo Avançado de Mentoria VIP',
    description: 'Semana com conteúdo direcionado de alta complexidade, jurisprudência recente e questões discursivas.',
    access: 'RESTRICTED',
    allowedEmails: ['wellington.nogueira18@gmail.com', 'aluno.vip@metaestudos.com.br'],
    days: [
      {
        day: 'Segunda-feira',
        shortDay: 'SEG',
        dateLabel: 'Dia 13',
        b1: {
          sub: 'Direito Constitucional',
          title: 'Controle de Constitucionalidade Concentrado',
          idx: 5,
          videoUrl: 'https://www.youtube.com/watch?v=5qap5aO4i9A',
          t1: 'ADI, ADC, ADO e ADPF: Legitimados Universais e Especiais',
          t2: 'Efeitos da decisão (ex tunc, erga omnes, modulação temporal)',
          durationMin: 70,
          type: 'theory'
        },
        b2: {
          sub: 'Direito Administrativo',
          title: 'Poderes Administrativos e Poder de Polícia',
          idx: 5,
          videoUrl: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
          t1: 'Hierárquico, Disciplinar, Regulamentar e Vinculado/Discricionário',
          t2: 'Ciclo de Polícia e Delegação a Pessoas Privadas (Tema STF 532)',
          durationMin: 60,
          type: 'theory'
        },
        b3: {
          sub: 'Mentoria Prática VIP',
          title: 'Análise de Jurisprudência Recente STF 2024-2026',
          idx: 'VIP-1',
          t1: 'Julgados de repercussão geral aplicados a concursos',
          durationMin: 50,
          type: 'practice'
        }
      },
      {
        day: 'Terça-feira',
        shortDay: 'TER',
        dateLabel: 'Dia 14',
        b1: {
          sub: 'Direito Penal',
          title: 'Ilicitude, Culpabilidade e Causas Excludentes',
          idx: 3,
          videoUrl: 'https://www.youtube.com/watch?v=kxy6vmsx2cI',
          t1: 'Estado de Necessidade, Legítima Defesa, Estrito Cumprimento',
          t2: 'Imputabilidade, Potencial Consciência e Exigibilidade de Conduta Diversa',
          durationMin: 65,
          type: 'theory'
        },
        b2: {
          sub: 'Língua Portuguesa',
          title: 'Concordância Verbal e Nominal Avançada',
          idx: 5,
          videoUrl: 'https://www.youtube.com/watch?v=9jK-NcRmVcw',
          t1: 'Verbos Impessoais (Haver e Fazer indicando tempo)',
          t2: 'Partícula SE como Pronome Apassivador vs Índice de Indeterminação',
          durationMin: 60,
          type: 'theory'
        },
        b3: {
          sub: 'Treinamento Intensivo',
          title: '35 Questões Nível Superior / Carreiras Jurídicas',
          idx: 'VIP-2',
          durationMin: 50,
          type: 'practice'
        }
      }
    ]
  }
];

export const SAMPLE_JSON_TEMPLATE = [
  {
    "day": "Segunda-feira",
    "shortDay": "SEG",
    "dateLabel": "Dia 01",
    "b1": {
      "sub": "Direito Constitucional",
      "title": "Organização do Estado e Repartição de Competências",
      "idx": 6,
      "videoUrl": "https://www.youtube.com/watch?v=5qap5aO4i9A",
      "t1": "Competências Exclusivas e Privativas da União (Arts. 21 e 22)",
      "t2": "Competências Comuns e Concorrentes (Arts. 23 e 24)",
      "t3": "Regras de prevalência de lei federal sobre estadual",
      "durationMin": 60,
      "type": "theory"
    },
    "b2": {
      "sub": "Língua Portuguesa",
      "title": "Regência Verbal e Nominal",
      "idx": 6,
      "videoUrl": "https://www.youtube.com/watch?v=kJQP7kiw5Fk",
      "t1": "Verbos transitivos diretos e indiretos com mudança de sentido (Aspirar, Visar, Assistir)",
      "t2": "Regência aplicada com pronomes relativos",
      "durationMin": 50,
      "type": "theory"
    },
    "b3": {
      "sub": "Bateria de Questões",
      "title": "30 Questões CEBRASPE / FGV Comentadas",
      "idx": "Q1",
      "t1": "15 Questões Competências Constitucionais",
      "t2": "15 Questões Regência Verbal",
      "durationMin": 45,
      "type": "practice"
    }
  },
  {
    "day": "Terça-feira",
    "shortDay": "TER",
    "dateLabel": "Dia 02",
    "b1": {
      "sub": "Direito Administrativo",
      "title": "Licitações Públicas - Nova Lei 14.133/2021",
      "idx": 6,
      "videoUrl": "https://www.youtube.com/watch?v=kxy6vmsx2cI",
      "t1": "Modalidades licitatórias: Pregão, Concorrência, Concurso, Leilão e Diálogo Competitivo",
      "t2": "Critérios de julgamento e fases do procedimento",
      "durationMin": 70,
      "type": "theory"
    },
    "b2": {
      "sub": "Raciocínio Lógico",
      "title": "Probabilidade e Probabilidade Condicional",
      "idx": 5,
      "videoUrl": "https://www.youtube.com/watch?v=9jK-NcRmVcw",
      "t1": "Espaço amostral e evento equiprovável",
      "t2": "Regra do produto e eventos independentes",
      "durationMin": 55,
      "type": "theory"
    },
    "b3": {
      "sub": "Caderno de Erros",
      "title": "Resolução Guiada de 20 Casos Práticos de Licitações",
      "idx": "Q2",
      "t1": "Hipóteses de Inexigibilidade vs Dispensa",
      "durationMin": 45,
      "type": "practice"
    }
  }
];
