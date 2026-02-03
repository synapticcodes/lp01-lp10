export type LpVariantId = `lp${string}`;

export interface HeroCopy {
  badge: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  bullets?: string[];
  ctaLabel: string;
  ctaMicrocopy?: string;
  eligibilityNotice?: string;
  topBarText?: string;
  topBarMicrotext?: string;
  boosterText?: string;
  showTrustBar?: boolean;
  trustBlockTitle?: string;
  trustBlockItems?: string[];
  showGuaranteeStamp?: boolean;
}

export interface FinalCtaCopy {
  title: string;
  body: string;
  ctaLabel: string;
  microcopy?: string;
  showGuaranteeStamp?: boolean;
  footerIdentificationLines?: string[];
  footerDisclaimer?: string;
  privacyPolicyTitle?: string;
  privacyPolicyBody?: string;
}

export interface ProblemCopy {
  badge: string;
  title: string;
  intro?: string;
  bullets: string[];
  note?: string;
  showCalculator?: boolean;
  calculatorTitle: string;
  calculatorBody: string;
  benefitLabel: string;
  percentLabel: string;
  resultLabel: string;
  closingLine: string;
}

export interface SolutionItemCopy {
  action: string;
  description: string;
}

export interface SolutionCopy {
  title: string;
  subtitle: string;
  mode?: "default" | "lp02";
  eligibilityTitle?: string;
  eligibilityYesTitle?: string;
  eligibilityYesItems?: string[];
  eligibilityNoTitle?: string;
  eligibilityNoItems?: string[];
  analysisTitle?: string;
  analysisBody?: string;
  analysisBullets?: string[];
  analysisNote?: string;
  badgeLeft: string;
  badgeRight: string;
  items: SolutionItemCopy[];
  beforeAfterTitle: string;
  beforeLabel: string;
  beforeRight: string;
  afterLabel: string;
  afterRight: string;
  beforeBarPercent?: number;
  afterBarPercent?: number;
  footer: string;
}

export interface TestimonialCopy {
  name: string;
  role: string;
  text: string;
  image?: string;
}

export interface TestimonialsCopy {
  title: string;
  testimonials: TestimonialCopy[];
  mode?: "default" | "documents";
  showProofImages?: boolean;
  documentsBody?: string;
  documentsBullets?: string[];
  documentsWarning?: string;
  showGuaranteeStamp?: boolean;
}

export interface BenefitsListItemCopy {
  title: string;
  description: string;
}

export interface BenefitsListCopy {
  title: string;
  items: BenefitsListItemCopy[];
}

export interface ProcessStepCopy {
  title: string;
  description: string;
}

export interface ProcessCopy {
  title: string;
  steps: ProcessStepCopy[];
  ctaLabel?: string;
}

export interface FaqItemCopy {
  question: string;
  answer: string;
}

export interface FaqCopy {
  title: string;
  items: FaqItemCopy[];
}

export interface LandingCopy {
  hero: HeroCopy;
  clarification?: ClarificationCopy;
  problem: ProblemCopy;
  solution: SolutionCopy;
  benefitsList?: BenefitsListCopy;
  testimonials: TestimonialsCopy;
  process: ProcessCopy;
  faq: FaqCopy;
  finalCta: FinalCtaCopy;
}

export interface ClarificationColumnCopy {
  title: string;
  bullets: string[];
}

export interface ClarificationCopy {
  mode?: "default" | "eligibility";
  title: string;
  intro?: string;
  left: ClarificationColumnCopy;
  right: ClarificationColumnCopy;
  exampleTitle?: string;
  exampleBody?: string;
}

const base: LandingCopy = {
  hero: {
    badge: "EXCLUSIVO PARA APOSENTADOS E PENSIONISTAS DO INSS",
    eyebrow: "Aposentado do INSS com descontos no benefício?",
    headline: "Recupere até 80% do seu benefício consumido por descontos ilegais.",
    subheadline:
      "Especialistas em direito previdenciário: ajudamos apenas aposentados e pensionistas do INSS a eliminar descontos ilegais, limpar o nome e recuperar a tranquilidade financeira sem risco — tudo 100% digital.",
    ctaLabel: "Quero minha análise gratuita",
  },
  problem: {
    badge: "O que os bancos não contam aos aposentados",
    title: "Cada mês que passa, mais dinheiro do INSS vai para os bancos",
    bullets: [
      "Descontos consignados que consomem ATÉ 80% do seu benefício mensal",
      "Juros abusivos em empréstimos que só aumentam, nunca diminuem",
      "Nome no SPC/SERASA impedindo novos créditos quando precisa",
      "Dependência financeira dos filhos na terceira idade",
      "Medo de perder a aposentadoria por conta de dívidas",
    ],
    calculatorTitle: "Calcule quanto você perde por mês",
    calculatorBody: "Informe um valor aproximado. É só para ter uma noção do tamanho do prejuízo.",
    benefitLabel: "Seu benefício (R$)",
    percentLabel: "% descontada",
    resultLabel: "Resultado",
    closingLine: "Pior: cada mês que passa, mais dinheiro do INSS vai para os bancos.",
  },
  solution: {
    title: "Não é milagre, é lei",
    subtitle: "A legislação previdenciária protege aposentados e pensionistas do INSS contra descontos abusivos.",
    badgeLeft: "INSS",
    badgeRight: "Proteção legal contra descontos abusivos",
    items: [
      { action: "Bloqueamos imediatamente", description: "novos descontos ilegais no seu benefício" },
      { action: "Reduzimos em até 80%", description: "os juros abusivos" },
      { action: "Retiramos seu nome", description: "do SPC/SERASA em até 30 dias" },
      { action: "Recuperamos valores", description: "pagos indevidamente nos últimos 5 anos" },
    ],
    beforeAfterTitle: "Antes / Depois",
    beforeLabel: "Antes",
    beforeRight: "80% descontado",
    afterLabel: "Depois",
    afterRight: "100% no bolso",
    footer: "Tudo 100% digital, sem precisar sair de casa.",
  },
  testimonials: {
    title: "Quem já recuperou o próprio benefício",
    testimonials: [
      {
        name: "João Silva",
        role: "68 anos, ex-motorista de ônibus",
        text: "Recuperei R$ 42.000 em descontos ilegais. Agora pago minhas contas e ainda ajudo meu neto na faculdade.",
        image: "/lovable-uploads/770f24ba-712b-48c6-8348-629c55780154.png",
      },
      {
        name: "Maria Santos",
        role: "61 anos, ex-professora",
        text: "Em 45 dias meu nome saiu do SERASA e recebi R$ 18.500 de volta. Finalmente durmo em paz.",
        image: "/lovable-uploads/0159e8f4-d08a-4cc3-b6b5-99ffcd5ba296.png",
      },
      {
        name: "Carlos Oliveira",
        role: "70 anos, ex-comerciante",
        text: "A equipe entende a realidade do aposentado. Respeitosos, pacientes e eficientes.",
        image: "/lovable-uploads/66607520-da93-457f-9540-627eb8234316.png",
      },
    ],
  },
  process: {
    title: "Como funciona em 3 passos simples",
    steps: [
      {
        title: "CONTE SEU CASO (2 min)",
        description: "Preencha nosso formulário seguro. Só precisamos do seu nome, WhatsApp e um valor aproximado do benefício.",
      },
      {
        title: "ANÁLISE GRATUITA (24–48h)",
        description: "Nossa equipe especializada em direito previdenciário analisa oportunidades no seu caso. Sem custo, sem compromisso.",
      },
      {
        title: "BENEFÍCIO LIVRE (até 30 dias)",
        description: "Assinamos digitalmente e iniciamos a recuperação do seu dinheiro, sem você precisar sair de casa.",
      },
    ],
  },
  faq: {
    title: "Perguntas frequentes",
    items: [
      {
        question: "É seguro para aposentados e pensionistas?",
        answer: "Sim. Trabalhamos dentro da legislação previdenciária. Seu benefício NÃO pode ser bloqueado ou suspenso por buscar seus direitos.",
      },
      {
        question: "Preciso ir até um escritório?",
        answer: "Não. Todo o processo é 100% digital. Atendemos por WhatsApp, e-mail e, se precisar, vídeo-chamada.",
      },
      {
        question: "E se eu não tiver computador?",
        answer: "Sem problema. Atendemos perfeitamente por celular. Nossos formulários são otimizados para smartphones.",
      },
      {
        question: "Como sei se tenho direito?",
        answer: "Se você é aposentado ou pensionista do INSS e tem descontos no benefício, provavelmente tem. A análise é gratuita para confirmar.",
      },
      {
        question: "Vou perder minha aposentadoria?",
        answer: "Nunca. Isso é mito. Seu benefício é vitalício e constitucional.",
      },
    ],
  },
  finalCta: {
    title: "Pronto para recuperar seu benefício?",
    body: "Não deixe mais um mês passar perdendo dinheiro com descontos abusivos. Sua análise gratuita está a um clique de distância.",
    ctaLabel: "Quero minha análise gratuita",
  },
};

export const landingVariants: Record<string, LandingCopy> = {
  "lp01": {
    ...base,
    hero: {
      badge: "APOSENTADOS/PENSIONISTAS DO INSS (ACIMA DE R$ 3.000)",
      eyebrow: "Benefício do INSS com desconto alto de consignado?",
      headline:
        "Solução jurídica especializada para reduzir descontos de consignado em até 70%",
      subheadline:
        "Serviço de advocacia previdenciária focado exclusivamente em aposentados com dívidas altas.",
      ctaLabel: "Quero minha análise jurídica",
      eligibilityNotice:
        "Importante: somos um escritório de advocacia especializado em direito previdenciário. NÃO somos consultoria financeira, NÃO fazemos empréstimos e NÃO somos correspondente bancário.\n\nNossa diferença: atuamos com mecanismos jurídicos específicos da legislação de proteção ao aposentado, evitando os custos e a demora de processos judiciais convencionais.",
      boosterText: "Atuação 100% remota via WhatsApp/telefone • Sigilo profissional",
    },
    clarification: {
      title: "Como é possível ser jurídico sem ser judicial?",
      intro: "Entenda a diferença:",
      left: {
        title: "Processo Judicial Tradicional",
        bullets: [
          "Demora 2–5 anos",
          "Custos altos com honorários",
          "Necessidade de audiências presenciais",
          "Resultado incerto",
        ],
      },
      right: {
        title: "Nossa Abordagem Jurídica Especializada",
        bullets: [
          "Atuação administrativa e negociação extrajudicial",
          "Baseada em leis específicas de proteção ao consumidor idoso",
          "Processo 100% remoto via WhatsApp/telefone",
          "Resultados em 3–6 meses (conforme o caso)",
          "Honorários fixos e transparentes",
        ],
      },
      exampleTitle: "Exemplo concreto",
      exampleBody:
        "A Lei 10.741/2003 (Estatuto do Idoso) e o Código de Defesa do Consumidor oferecem mecanismos específicos para revisão de contratos que podem ser utilizados antes de qualquer ação judicial.",
    },
    problem: {
      ...base.problem,
      badge: "Quando o consignado vira sufoco",
      title: "Se o consignado consome o benefício, a vida não fecha",
      intro:
        "Se você recebe mais de R$ 3.000 e está com descontos altos, estes sinais costumam aparecer:",
      bullets: [
        "Descontos mensais que comprometem o orçamento (aluguel, remédios e contas básicas)",
        "Vários contratos de consignado (e refinanciamentos ao longo do tempo)",
        "Juros e condições difíceis de entender, com sensação de “bola de neve”",
        "Medo de ficar sem dinheiro no fim do mês e depender de familiares",
        "Dúvidas sobre irregularidades e abusos nos contratos",
      ],
    },
    solution: {
      ...base.solution,
      title: "Não é milagre: é atuação jurídica previdenciária",
      subtitle:
        "Atuamos com mecanismos jurídicos específicos para aposentados, via abordagem jurídica administrativa e negociação extrajudicial — e, quando necessário, com medidas judiciais específicas e ágeis.",
      badgeRight: "Mecanismos jurídicos específicos para aposentados",
      items: [
        {
          action: "Análise técnica dos contratos",
          description: "para identificar vícios, abusos e irregularidades",
        },
        {
          action: "Notificações e pedidos administrativos",
          description: "com base na legislação aplicável ao consumidor idoso",
        },
        {
          action: "Negociação extrajudicial estruturada",
          description: "com argumentação jurídica e prerrogativas da advocacia",
        },
        {
          action: "Medidas judiciais específicas (quando necessário)",
          description: "sempre com sua autorização e foco em agilidade",
        },
      ],
    beforeAfterTitle: "Impacto no seu mês (exemplo)",
    beforeRight: "Desconto alto",
    afterRight: "Até 70% menor",
    beforeBarPercent: 90,
    afterBarPercent: 30,
    footer:
      "Atuação jurídica focada em negociação extrajudicial e proteção do seu benefício (conforme o caso).",
  },
    process: {
      title: "Como funciona (passo a passo jurídico)",
      steps: [
        {
          title: "Etapa 1: Análise Jurídica Especializada",
          description:
            "Nossos advogados previdenciários analisam seus contratos identificando vícios, abusos e irregularidades à luz da legislação específica de proteção ao aposentado.",
        },
        {
          title: "Etapa 2: Estratégia Jurídica Personalizada",
          description:
            "Desenvolvemos um plano baseado nos mecanismos legais disponíveis: notificações extrajudiciais, pedidos administrativos aos bancos e, quando necessário, medidas judiciais específicas e ágeis.",
        },
        {
          title: "Etapa 3: Atuação Jurídica Estruturada",
          description:
            "Atuamos junto às instituições com argumentação técnica sólida, utilizando as prerrogativas da advocacia para obter reduções significativas.",
        },
        {
          title: "Etapa 4: Acompanhamento Jurídico Contínuo",
          description:
            "Garantimos a efetividade dos acordos e a proteção permanente do seu benefício.",
        },
      ],
      ctaLabel: "Quero falar com um especialista",
    },
    faq: {
      title: "Perguntas frequentes",
      items: [
        {
          question: "Isso é um processo judicial?",
          answer:
            "Não necessariamente. Iniciamos sempre com atuação administrativa e negociação extrajudicial, utilizando mecanismos legais específicos. Apenas em casos excepcionais (e sempre com sua autorização) recorremos a medidas judiciais específicas.",
        },
        {
          question: "Vocês são advogados?",
          answer:
            "Sim. Somos escritório de advocacia especializado em direito previdenciário e proteção do consumidor idoso. Nossa OAB está disponível para consulta.",
        },
        {
          question: "Vou precisar ir à Justiça?",
          answer:
            "Em 92% dos casos, resolvemos via negociação extrajudicial utilizando os mecanismos legais disponíveis. Nos 8% restantes, utilizamos medidas judiciais específicas e ágeis.",
        },
        {
          question: "Qual a vantagem sobre um advogado comum?",
          answer:
            "Especialização. Trabalhamos exclusivamente com aposentados do INSS e conhecemos profundamente a legislação específica que os protege.",
        },
      ],
    },
    finalCta: {
      title: "Quer saber se você se qualifica para a solução?",
      body:
        "Responda uma triagem rápida. Se o seu caso se encaixar, nossa equipe jurídica entra em contato para orientar os próximos passos.",
      ctaLabel: "Falar com especialista",
      microcopy: "Atendimento jurídico mediante análise individual. Sem promessa de resultado.",
      showGuaranteeStamp: false,
      footerIdentificationLines: [
        "Informações Importantes:",
        "• Serviço prestado por escritório de advocacia regularmente inscrito na OAB",
        "• Honorários advocatícios conforme tabela da OAB/SP",
        "• Resultados podem variar conforme caso concreto",
        "• Não garantimos resultados específicos, mas atuamos com base na legislação aplicável",
      ],
      footerDisclaimer: "Processo sujeito à análise prévia de viabilidade jurídica.",
    },
  },
  "lp02": {
    ...base,
    hero: {
      badge: "Para aposentados e pensionistas do INSS",
      eyebrow: "",
      headline: "Empréstimo consignado no INSS comprometendo seu benefício?",
      subheadline:
        "Realizamos avaliação jurídica inicial para verificar se o seu caso tem viabilidade e quais medidas cabíveis podem ser aplicadas para reorganizar os descontos e avançar rumo à quitação.",
      bullets: [
        "Análise do cenário de descontos no benefício",
        "Orientação jurídica inicial com base em documentos",
        "Atendimento pelo WhatsApp, com sigilo profissional",
      ],
      ctaLabel: "✅ Solicitar triagem do meu caso",
      ctaMicrocopy: "Serviço jurídico remunerado mediante contrato. Sem promessa de resultado.",
      eligibilityNotice:
        "Não atuamos em casos de CLT/consignado privado. Não oferecemos empréstimo.",
      topBarText:
        "Atuação jurídica voltada a aposentados e pensionistas do INSS com desconto de empréstimo consignado no benefício.",
      topBarMicrotext: "Conteúdo informativo. Atendimento mediante análise individual.",
      boosterText: "",
      showTrustBar: true,
      trustBlockTitle: "Como funciona o primeiro contato",
      trustBlockItems: [
        "Triagem rápida (2 minutos)",
        "Você envia informações básicas e, se fizer sentido, seguimos com a análise",
        "Seus dados são tratados conforme a Política de Privacidade (LGPD)",
      ],
      showGuaranteeStamp: false,
    },
    problem: {
      ...base.problem,
      badge: "Quando o consignado pesa",
      title: "Quando o consignado pesa, o benefício deixa de fechar",
      intro: "Alguns sinais comuns em quem procura ajuda jurídica para consignado no INSS:",
      bullets: [
        "Desconto mensal alto no benefício, sobrando pouco para despesas da casa",
        "Vários contratos de consignado (ou refinanciamentos ao longo do tempo)",
        "Dificuldade para organizar parcelas e enxergar um caminho de quitação",
        "Insegurança com descontos e contratos, sem saber o que é possível fazer",
      ],
      note: "Cada caso é individual e depende de análise documental.",
      showCalculator: false,
      calculatorTitle: "",
      calculatorBody: "",
      benefitLabel: "",
      percentLabel: "",
      resultLabel: "",
      closingLine: "",
    },
    solution: {
      ...base.solution,
      mode: "lp02",
      title: "",
      subtitle: "",
      eligibilityTitle: "Este atendimento é indicado para quem",
      eligibilityYesTitle: "Indicado",
      eligibilityYesItems: [
        "Recebe benefício do INSS (aposentadoria ou pensão)",
        "Tem empréstimo consignado descontando no benefício",
        "Está com dificuldade de equilibrar o orçamento familiar por causa dos descontos",
        "Busca orientação jurídica para reorganizar o cenário e caminhar para a quitação",
      ],
      eligibilityNoTitle: "Não indicado",
      eligibilityNoItems: [
        "CLT/consignado privado (desconto em folha de empresa)",
        "Quem procura empréstimo novo ou liberação de crédito",
        "Quem busca “resultado garantido” ou soluções imediatas sem análise",
      ],
      analysisTitle: "O que avaliamos na etapa inicial",
      analysisBody:
        "A avaliação jurídica inicial tem o objetivo de entender o seu cenário e indicar o caminho adequado. Em geral, analisamos:",
      analysisBullets: [
        "Quantidade de contratos e valor aproximado dos descontos mensais",
        "Tipo de desconto vinculado ao benefício e histórico do endividamento",
        "Documentos e informações necessárias para confirmar o cenário",
        "Possíveis medidas jurídicas cabíveis para reorganização do caso (quando houver viabilidade)",
      ],
      analysisNote:
        "Não há garantia de resultado. A atuação depende das particularidades e documentos do caso.",
    },
    testimonials: {
      ...base.testimonials,
      mode: "documents",
      title: "O que pode ser solicitado na triagem",
      testimonials: [],
      documentsBody: "Para agilizar, podemos pedir alguns itens (conforme o caso):",
      documentsBullets: [
        "Extrato/registro de empréstimos consignados do benefício",
        "Comprovante do desconto mensal (quando disponível)",
        "Informações básicas sobre contratos ativos",
      ],
      documentsWarning: "⚠️ Não solicitamos senha de aplicativos, e não pedimos códigos de verificação.",
      showGuaranteeStamp: false,
    },
    process: {
      ...base.process,
      title: "Como funciona em 3 etapas",
      ctaLabel: "✅ Solicitar triagem do meu caso",
      steps: [
        {
          title: "Triagem (2 minutos)",
          description:
            "Você responde perguntas rápidas para verificarmos se o caso é de consignado no INSS e se faz sentido avançar.",
        },
        {
          title: "Coleta de informações essenciais",
          description:
            "Caso seja elegível, solicitamos os documentos/prints necessários para entender o cenário de descontos.",
        },
        {
          title: "Avaliação jurídica e próximos passos",
          description:
            "Com as informações, apresentamos a viabilidade e o encaminhamento possível, conforme o caso.",
        },
      ],
    },
    faq: {
      ...base.faq,
      title: "Perguntas frequentes",
      items: [
        {
          question: "Vocês atendem CLT (carteira assinada)?",
          answer: "Não. A atuação é voltada a casos de empréstimo consignado com desconto no benefício do INSS.",
        },
        {
          question: "Isso é empréstimo ou liberação de crédito?",
          answer: "Não. Trata-se de serviço jurídico, com avaliação e atuação conforme a viabilidade do caso.",
        },
        {
          question: "Tem custo?",
          answer: "Sim. A atuação jurídica é remunerada mediante contrato. Os detalhes são apresentados após a triagem e análise inicial.",
        },
        {
          question: "Em quanto tempo resolve?",
          answer: "Depende do caso e dos documentos. Não é possível garantir prazo ou resultado.",
        },
        {
          question: "Quais informações preciso enviar?",
          answer: "Na triagem, pedimos informações básicas. Se o caso for elegível, solicitamos documentos essenciais para análise.",
        },
        {
          question: "Meus dados ficam seguros?",
          answer: "Seguimos práticas de segurança e tratamos dados conforme nossa Política de Privacidade.",
        },
        {
          question: "Vocês pedem senha do Meu INSS/banco?",
          answer: "Não.",
        },
      ],
    },
    finalCta: {
      ...base.finalCta,
      title: "Quer verificar se o seu caso se encaixa?",
      body:
        "Responda a triagem rápida. Se houver viabilidade, nossa equipe entra em contato pelo WhatsApp.",
      ctaLabel: "✅ Solicitar triagem do meu caso",
      microcopy: "Serviço jurídico remunerado mediante contrato. Conteúdo informativo.",
      showGuaranteeStamp: false,
      footerDisclaimer:
        "Esta página tem caráter informativo e não substitui consulta jurídica individual. A atuação depende de análise do caso concreto e documentação.",
      privacyPolicyTitle: "Política de Privacidade (LGPD)",
      privacyPolicyBody:
        "Usamos seus dados apenas para realizar a triagem e retornar contato sobre o atendimento jurídico. Não solicitamos senhas, códigos de verificação ou acesso a aplicativos. Você pode solicitar atualização ou exclusão de dados pelos canais informados no rodapé.",
    },
  },
  "lp03": {
    ...base,
    hero: {
      ...base.hero,
      topBarText:
        "ATENÇÃO: ATENDIMENTO EXCLUSIVO PARA SERVIDORES PÚBLICOS, APOSENTADOS E PENSIONISTAS.",
      badge: "Somente para servidores públicos, aposentados e pensionistas",
      eyebrow:
        "Se a parcela do consignado está tirando sua paz, este atendimento pode ser para você.",
      headline: "O Banco desconta mais de 30% do seu benefício todo mês? Isso pode ser ilegal.",
      subheadline:
        "Recupere o controle do seu salário. Atuamos na revisão administrativa e judicial de parcelas de empréstimos consignados que comprometem sua dignidade e o sustento da sua família.",
      ctaLabel: "QUERO ANALISAR MEU CASO GRATUITAMENTE",
      ctaMicrocopy:
        "Análise sigilosa. Não somos banco, somos uma assessoria especializada em proteção de renda.",
      boosterText: "Atendimento sério, com orientação clara e sem promessas irreais.",
      showTrustBar: true,
      showGuaranteeStamp: false,
    },
    clarification: {
      mode: "eligibility",
      title: "Para quem é esta Assessoria Especializada?",
      intro:
        "Para proteger seu tempo (e o nosso), confira abaixo se o seu perfil se encaixa antes de avançar.",
      left: {
        title: "✅ SIM — NÓS ATENDEMOS",
        bullets: [
          "Aposentados pelo INSS",
          "Pensionistas",
          "Servidores públicos (federais, estaduais e municipais)",
          "Renda familiar acima de R$ 3.000",
          "Dificuldade com empréstimos consignados (desconto em folha/benefício)",
        ],
      },
      right: {
        title: "❌ NÃO ATENDEMOS",
        bullets: [
          "Trabalhadores CLT (empresa privada)",
          "Autônomos, empresários ou desempregados",
          "Dívidas apenas de cartão de loja/varejo",
          "Quem busca empréstimo (não emprestamos dinheiro)",
          "Causas trabalhistas",
        ],
      },
    },
    problem: {
      ...base.problem,
      badge: "Quando o desconto vira sufoco",
      title: "Você se sente trabalhando apenas para pagar juros?",
      intro: undefined,
      bullets: [
        "⚠ O ciclo do refinanciamento: o “troco” aumenta o prazo e prende você por mais anos.",
        "⚠ Salário líquido zero: o benefício cai na conta e os descontos automáticos levam quase tudo.",
        "⚠ Bola de neve: para pagar contas básicas, você recorre ao cartão/cheque especial e cria novas dívidas.",
      ],
      showCalculator: false,
      note:
        "“Parece um caminho sem volta. Mas a legislação brasileira protege o seu mínimo existencial. O banco não pode tirar de você o dinheiro da sua sobrevivência.”",
    },
    solution: {
      ...base.solution,
      title: "Não é calote. É Justiça Financeira.",
      subtitle:
        "Nossa assessoria utiliza base legal do superendividamento e da defesa do consumidor para buscar uma renegociação justa e proteger sua renda.",
      badgeLeft: "Proteção de renda",
      badgeRight: "Negociação bancária com base legal",
      items: [
        {
          action: "Auditoria de contratos",
          description:
            "analisamos juros, cláusulas e possíveis abusos (incluindo vendas casadas e irregularidades).",
        },
        {
          action: "Trava de segurança",
          description:
            "atuamos para limitar descontos mensais a um valor que caiba no seu bolso, preservando seu sustento.",
        },
        {
          action: "Renegociação especializada",
          description:
            "assumimos a conversa com os credores para reduzir o “sangramento” do seu salário e buscar condições justas.",
        },
      ],
      beforeAfterTitle: "Impacto no seu mês (exemplo)",
      beforeLabel: "Antes",
      beforeRight: "Desconto acima do limite",
      afterLabel: "Depois",
      afterRight: "Desconto compatível com sua renda",
      beforeBarPercent: 45,
      afterBarPercent: 30,
      footer: "A atuação depende de análise do caso concreto e documentação.",
    },
    testimonials: {
      title:
        "Chega de viver no aperto. Você trabalhou a vida toda, merece tranquilidade.",
      testimonials: [
        {
          name: "Carlos M.",
          role: "Servidor público aposentado",
          text: "Eu achava que ia morrer pagando empréstimo. A equipe me atendeu muito bem e conseguimos reduzir a parcela em 40%.",
          image: "/lovable-uploads/770f24ba-712b-48c6-8348-629c55780154.png",
        },
        {
          name: "Ana R.",
          role: "Pensionista",
          text: "O que mais me aliviou foi ver dinheiro sobrando no fim do mês. Me explicaram tudo com clareza e sem enrolação.",
          image: "/lovable-uploads/0159e8f4-d08a-4cc3-b6b5-99ffcd5ba296.png",
        },
        {
          name: "Marcos P.",
          role: "Servidor público",
          text: "Eu estava no ciclo do refinanciamento. Depois da análise, consegui organizar os descontos e voltei a ter fôlego no orçamento.",
          image: "/lovable-uploads/66607520-da93-457f-9540-627eb8234316.png",
        },
      ],
      showGuaranteeStamp: false,
    },
    process: {
      title: "Como funciona a análise (com seriedade e sigilo)",
      steps: [
        {
          title: "TRIAGEM (rápida)",
          description:
            "Você responde 3 perguntas para confirmar se o perfil se encaixa no atendimento.",
        },
        {
          title: "ANÁLISE INICIAL (gratuita)",
          description:
            "Se o perfil estiver aprovado, um especialista avalia o cenário e orienta os próximos passos.",
        },
        {
          title: "ENCAMINHAMENTO",
          description:
            "Com o diagnóstico, definimos a estratégia possível (administrativa e/ou judicial), conforme o caso.",
        },
      ],
      ctaLabel: "Quero fazer a triagem agora",
    },
    faq: {
      title: "Dúvidas Comuns sobre a Recuperação de Margem",
      items: [
        {
          question: "Vocês fazem empréstimo ou compra de dívidas?",
          answer:
            "Não. Somos uma assessoria especializada em negociação bancária e defesa do consumidor. Nosso trabalho é revisar seus contratos atuais para reduzir os descontos, não criar uma nova dívida. Se você procura empréstimo, este serviço não é para você.",
        },
        {
          question: "O banco pode cancelar minha conta se eu procurar meus direitos?",
          answer:
            "É ilegal o banco retaliar o cliente por buscar a revisão de cobranças abusivas. Seu direito de questionar e proteger seu sustento é garantido por lei. Nossa equipe orienta você para que sua conta salário permaneça segura.",
        },
        {
          question: "Sou funcionário de empresa privada (CLT), posso fazer?",
          answer:
            "No momento, nossa atuação é focada exclusivamente em servidores públicos, aposentados e pensionistas. A dinâmica de desconto em folha é diferente para estas categorias, permitindo uma defesa mais eficaz.",
        },
        {
          question: "Meu nome vai ficar “sujo”?",
          answer:
            "O foco do nosso trabalho é a recuperação do seu salário líquido. Durante a negociação, o objetivo principal é fazer sobrar dinheiro na sua conta todo mês para você viver com dignidade.",
        },
        {
          question: "Existe algum custo para realizar o serviço?",
          answer:
            "A análise inicial é gratuita. Caso identifiquemos viabilidade, apresentaremos uma proposta de honorários que pode ser parcelada. Você só contrata se fizer sentido para você.",
        },
      ],
    },
    finalCta: {
      title: "Quer saber se o seu caso se encaixa?",
      body:
        "Faça a triagem em poucos segundos. Se você passar pelo filtro, liberamos o acesso direto ao WhatsApp para falar com um especialista.",
      ctaLabel: "Fazer triagem agora",
      microcopy:
        "Atendimento exclusivo para servidores públicos, aposentados e pensionistas. Não fazemos empréstimos.",
      showGuaranteeStamp: false,
      footerIdentificationLines: [
        "Este site não tem vínculo com o Governo Federal ou bancos. Somos uma empresa privada de assessoria.",
      ],
      footerDisclaimer:
        "Conteúdo informativo. A atuação depende de análise do caso concreto e documentação. Resultados e prazos variam conforme o caso.",
      privacyPolicyTitle: "Política de Privacidade (LGPD)",
      privacyPolicyBody:
        "Usamos seus dados apenas para realizar a triagem e viabilizar contato com um especialista. Não solicitamos senhas, códigos de verificação ou acesso a aplicativos.",
    },
  },
  "lp04": {
    ...base,
    hero: {
      badge: "⚠️ EXCLUSIVO PARA APOSENTADOS E PENSIONISTAS",
      eyebrow: "Dívidas de consignado consumindo seu benefício?",
      headline: "Reduza Até 90% das Suas Dívidas de Empréstimo Consignado",
      subheadline:
        "Solução jurídica especializada para aposentados que comprometeram seu benefício com múltiplos consignados.",
      bullets: [
        "Apenas Aposentados/Pensionistas",
        "Renda mínima R$ 3.000",
        "Dívidas acima de R$ 15.000",
      ],
      ctaLabel: "VERIFICAR SE ME QUALIFICO - GRÁTIS",
      ctaMicrocopy: "🔒 Seus dados estão seguros | ⏱️ Resposta em até 2 horas úteis",
      boosterText: "Análise inicial gratuita e sem compromisso.",
    },
    clarification: {
      mode: "eligibility",
      title: "Você se Enquadra no Nosso Programa?",
      intro:
        "Nosso serviço jurídico é especializado e atende apenas casos que se enquadram nos seguintes critérios:",
      left: {
        title: "Critérios para atendimento",
        bullets: [
          "É aposentado ou pensionista do INSS/Servidor Público",
          "Recebe benefício mensal acima de R$ 3.000",
          "Possui empréstimo consignado descontado na folha",
          "Suas dívidas somam mais de R$ 15.000",
          "Mais de 35% do seu benefício está comprometido",
          "Tem condições de investir em assessoria jurídica especializada",
        ],
      },
      right: {
        title: "Este programa não é indicado se você…",
        bullets: [
          "É CLT/Autônomo (não atendemos nesta modalidade)",
          "Recebe benefício mensal de até R$ 3.000",
          "Tem dívidas de consignado abaixo de R$ 15.000",
          "Tem até 30% do benefício comprometido com descontos",
        ],
      },
      exampleTitle: "Se você respondeu SIM para todos os itens acima, podemos te ajudar!",
      exampleBody: "Continue rolando para preencher o formulário de qualificação.",
    },
    problem: {
      badge: "⚠️ Aviso importante",
      title: "Serviço jurídico especializado com investimento (não é gratuito)",
      intro:
        "Nosso trabalho envolve advogados especializados, estratégia personalizada e acompanhamento do seu caso — por isso há investimento. A análise inicial é gratuita.",
      bullets: [
        "Sem cobranças antecipadas para análise",
        "12x de R$ 450 (parcelamento padrão)",
        "12x de R$ 350 (condições especiais)",
        "26x de R$ 195 (casos específicos)",
        "O investimento é mínimo comparado à economia que você pode ter",
        "Não trabalhamos com casos gratuitos ou pro-bono",
      ],
      showCalculator: false,
      calculatorTitle: "Calcule quanto você perde por mês",
      calculatorBody: "Informe um valor aproximado. É só para ter uma noção do tamanho do prejuízo.",
      benefitLabel: "Seu benefício (R$)",
      percentLabel: "% descontada",
      resultLabel: "Resultado",
      closingLine: "Pior: cada mês que passa, mais dinheiro do seu benefício vai para os bancos.",
    },
    solution: {
      title: "Como Reduzimos Suas Dívidas Legalmente",
      subtitle:
        "Utilizamos estratégias jurídicas especializadas para renegociar suas dívidas consignadas com descontos de até 90%.",
      badgeLeft: "Jurídico",
      badgeRight: "Estratégia baseada em jurisprudência favorável",
      items: [
        {
          action: "Análise gratuita",
          description: "do seu caso, das dívidas consignadas e da sua margem de benefício",
        },
        {
          action: "Estratégia jurídica personalizada",
          description: "com base em jurisprudência favorável para superendividamento",
        },
        {
          action: "Execução e negociação",
          description: "direta com os bancos para buscar redução de dívida e parcelas mais viáveis",
        },
        {
          action: "Acompanhamento profissional",
          description: "com transparência e orientação em cada etapa do processo",
        },
      ],
      beforeAfterTitle: "Antes / Depois",
      beforeLabel: "Antes",
      beforeRight: "Dívidas altas",
      afterLabel: "Depois",
      afterRight: "Até 90% menor",
      beforeBarPercent: 100,
      afterBarPercent: 10,
      footer: "O objetivo é desafogar seu benefício e te devolver tranquilidade financeira.",
    },
    testimonials: {
      title: "Aposentados Que Já Conquistaram Sua Liberdade Financeira",
      showProofImages: true,
      showGuaranteeStamp: false,
      testimonials: [
        {
          name: "José Carlos",
          role: "64 anos — Aposentado INSS",
          text:
            "⭐⭐⭐⭐⭐ “Tinha R$ 52.000 em dívidas de consignado e só me sobravam R$ 800 do meu benefício de R$ 3.200. Após o trabalho da equipe, consegui reduzir para R$ 15.000 e agora respiro! Vale cada centavo investido.”",
          image: "/lovable-uploads/770f24ba-712b-48c6-8348-629c55780154.png",
        },
        {
          name: "Maria Aparecida",
          role: "59 anos — Pensionista",
          text:
            "⭐⭐⭐⭐⭐ “Estava pagando 7 consignados diferentes que consumiam quase todo meu benefício. Hoje pago apenas uma parcela acessível e voltei a ter qualidade de vida. Recomendo para todos os aposentados!”",
          image: "/lovable-uploads/0159e8f4-d08a-4cc3-b6b5-99ffcd5ba296.png",
        },
        {
          name: "Antônio Silva",
          role: "67 anos — Servidor aposentado",
          text:
            "⭐⭐⭐⭐⭐ “Achei que nunca sairia dessa bola de neve. Com mais de R$ 68.000 em dívidas, consegui negociar por R$ 22.000. Agora posso ajudar meus netos e viver dignamente com meu benefício.” Redução de 68% nas dívidas totais.",
          image: "/lovable-uploads/66607520-da93-457f-9540-627eb8234316.png",
        },
      ],
    },
    process: {
      title: "Como Reduzimos Suas Dívidas Legalmente",
      steps: [
        {
          title: "PASSO 1 — Análise gratuita",
          description:
            "Nosso especialista analisa seu caso, suas dívidas consignadas e sua margem de benefício para verificar a viabilidade.",
        },
        {
          title: "PASSO 2 — Estratégia jurídica",
          description:
            "Desenvolvemos uma estratégia personalizada baseada em jurisprudência favorável para aposentados superendividados.",
        },
        {
          title: "PASSO 3 — Execução e resultados",
          description:
            "Nossa equipe jurídica negocia diretamente com os bancos para reduzir suas dívidas e desafogar seu benefício.",
        },
      ],
      ctaLabel: "QUERO FALAR COM UM ESPECIALISTA AGORA",
    },
    faq: {
      title: "Dúvidas Frequentes dos Aposentados",
      items: [
        {
          question: "1. Quem pode ser atendido por vocês?",
          answer:
            "Atendemos exclusivamente aposentados e pensionistas (INSS ou servidores públicos) que recebem benefício acima de R$ 3.000 mensais, possuem dívidas de empréstimo consignado acima de R$ 15.000, têm mais de 35% do benefício comprometido com descontos e podem investir em assessoria jurídica especializada.",
        },
        {
          question: "2. CLT pode ser atendido?",
          answer:
            "Nosso programa é especializado em aposentados e pensionistas. Trabalhadores CLT ativos têm situação jurídica diferente e não se enquadram no nosso método.",
        },
        {
          question: "3. Como vocês conseguem reduzir até 90% das dívidas?",
          answer:
            "Utilizamos estratégias jurídicas baseadas em legislação específica para proteção de aposentados superendividados. Nossa equipe jurídica especializada negocia com os bancos usando jurisprudência favorável.",
        },
        {
          question: "4. Quanto custa o serviço?",
          answer:
            "Trabalhamos com investimento acessível: 12x de R$ 450 (modalidade padrão), 12x de R$ 350 (condições especiais) ou 26x de R$ 195 (casos específicos). A economia gerada tende a ser maior que o investimento.",
        },
        {
          question: "5. Preciso pagar algo antes para fazer a análise?",
          answer:
            "Não. A análise inicial do seu caso é gratuita. Você só investe após entender o processo e decidir prosseguir.",
        },
        {
          question: "6. Quanto tempo demora o processo?",
          answer:
            "O processo varia de acordo com cada caso, geralmente entre 4 e 12 meses. Nossa equipe mantém você informado em todas as etapas.",
        },
        {
          question: "7. Vou parar de pagar os consignados?",
          answer:
            "Orientamos sobre o melhor momento estratégico para suspender pagamentos conforme a estratégia jurídica — sempre dentro da legalidade e com acompanhamento profissional.",
        },
        {
          question: "8. Meu nome vai ficar sujo?",
          answer:
            "Trabalhamos para minimizar impactos no CPF. O objetivo é resolver a situação de forma legal e sustentável, protegendo seu benefício.",
        },
        {
          question: "9. Como sei que é confiável?",
          answer:
            "Você terá contrato, acompanhamento transparente e uma equipe jurídica especializada. Resultados e prazos variam conforme o caso e a documentação.",
        },
        {
          question: "10. E se minha dívida for pequena (menos de R$ 15.000)?",
          answer:
            "Nosso serviço é direcionado a casos mais complexos com dívidas maiores. Para dívidas menores, o custo-benefício do processo jurídico pode não compensar.",
        },
        {
          question: "11. Servidor público ativo pode ser atendido?",
          answer:
            "Se você é servidor público aposentado, sim. Servidores ativos têm dinâmica diferente e não se enquadram no nosso programa específico.",
        },
        {
          question: "12. Posso parcelar o investimento?",
          answer:
            "Sim. Oferecemos parcelamento em até 12x ou 26x (casos específicos) para facilitar o acesso ao serviço.",
        },
      ],
    },
    finalCta: {
      title: "Não Deixe Suas Dívidas Consumirem Seu Benefício",
      body:
        "Você trabalhou a vida inteira para ter uma aposentadoria digna. Não é justo que os bancos fiquem com quase todo seu benefício. ✓ Análise gratuita do seu caso • ✓ Sem compromisso inicial • ✓ Especialistas em aposentados",
      ctaLabel: "SOLICITAR ANÁLISE GRATUITA AGORA",
      microcopy: "Atendimento de segunda a sexta, das 8h às 18h • Resposta em até 2 horas úteis",
      showGuaranteeStamp: false,
      footerIdentificationLines: [
        "Este site oferece serviços jurídicos especializados para aposentados e pensionistas.",
        "Não somos escritório de advocacia pro-bono. Investimento necessário.",
        "Política de Privacidade • Termos de Uso • Contato",
      ],
      footerDisclaimer:
        "Conteúdo informativo. A atuação depende de análise do caso concreto e documentação. Resultados e prazos variam conforme o caso.",
      privacyPolicyTitle: "Política de Privacidade (LGPD)",
      privacyPolicyBody:
        "Usamos seus dados apenas para realizar a triagem e viabilizar contato com um especialista. Não solicitamos senhas, códigos de verificação ou acesso a aplicativos.",
    },
  },
  "lp05": {
    ...base,
    hero: {
      ...base.hero,
      badge: "EXCLUSIVO PARA APOSENTADOS E PENSIONISTAS DO INSS (ACIMA DE R$ 3.000)",
      eyebrow: "Benefício INSS com desconto alto de consignado?",
      headline:
        "Aposentado ou Pensionista do INSS? Reduza até 60% nas parcelas do seu empréstimo consignado e quite dívidas altas de forma definitiva.",
      subheadline:
        "Exclusivo para quem recebe benefício INSS acima de R$ 3.000 e tem descontos altos comprometendo a aposentadoria. Libere sua margem consignada e volte a receber seu benefício com mais tranquilidade.",
      ctaLabel: "Quero uma análise gratuita do meu caso",
      ctaMicrocopy: "Leva menos de 2 minutos. Atendimento 100% digital e com sigilo.",
      eligibilityNotice:
        "Importante: atendemos apenas aposentados e pensionistas do INSS com empréstimos consignados ativos. Não atuamos com CLT/consignado privado e não oferecemos empréstimo novo. A análise é gratuita; resultados dependem do caso e da documentação.",
      boosterText:
        "Cansado de ver grande parte do seu benefício indo para parcelas? Ajudamos a bloquear descontos abusivos, reduzir parcelas e buscar quitação definitiva com acompanhamento especializado.",
    },
    clarification: {
      mode: "eligibility",
      title: "Essa solução é ideal se você:",
      intro:
        "Para proteger seu tempo (e o nosso), confira os requisitos mínimos antes de avançar para a análise gratuita.",
      left: {
        title: "✅ SIM — perfil ideal",
        bullets: [
          "É aposentado ou pensionista do INSS",
          "Recebe benefício mensal acima de R$ 3.000",
          "Tem empréstimos consignados ativos com descontos no benefício",
          "Dívidas altas em consignados (acima de R$ 15.000 costuma trazer melhores resultados)",
          "Quer acompanhamento personalizado por especialistas",
        ],
      },
      right: {
        title: "❌ NÃO conseguimos ajudar se",
        bullets: [
          "Você não é aposentado/pensionista do INSS",
          "Seu benefício é até R$ 3.000",
          "Você não tem consignados ativos descontando no benefício",
          "Você busca empréstimo novo/liberação de crédito",
          "O caso é CLT/consignado privado (desconto em folha de empresa)",
        ],
      },
      exampleTitle: "Se não se enquadra, tudo bem",
      exampleBody:
        "Se seu perfil mudar (por exemplo, benefício acima de R$ 3.000 e consignados ativos), volte aqui e faremos uma nova triagem.",
    },
    problem: {
      ...base.problem,
      badge: "Quando o consignado aperta",
      title: "Quando o consignado consome sua aposentadoria, sobra pouco para viver",
      intro:
        "Se você tem descontos altos no benefício do INSS, estes sinais costumam aparecer:",
      bullets: [
        "Parcelas de consignado comprometendo remédios, contas e despesas básicas",
        "Refinanciamentos que aumentam prazos e prendem a renda por anos",
        "Margem consignada travada, sem espaço para reorganizar a vida",
        "Dúvidas sobre cobranças, taxas e descontos que parecem abusivos",
        "Ansiedade por ver o benefício cair e desaparecer em descontos automáticos",
      ],
      calculatorTitle: "Veja quanto sai do seu benefício todo mês",
      calculatorBody:
        "Informe valores aproximados apenas para ter noção do impacto. A análise do caso é individual.",
      benefitLabel: "Seu benefício (R$)",
      percentLabel: "% descontado em consignados",
      resultLabel: "Estimativa",
      closingLine:
        "Se os descontos estão altos, uma análise especializada pode indicar caminhos legais para reduzir parcelas e liberar margem.",
    },
    solution: {
      ...base.solution,
      title: "Por que escolher nossa ajuda?",
      subtitle:
        "Assessoria especializada em consignados no benefício do INSS, com triagem e plano personalizado conforme a sua documentação.",
      badgeLeft: "INSS",
      badgeRight: "Especialistas em consignado no benefício",
      items: [
        { action: "Análise completa e gratuita", description: "do seu caso INSS" },
        { action: "Acompanhamento personalizado", description: "por especialistas em direito previdenciário" },
        { action: "Redução em até 60%", description: "das parcelas atuais (conforme elegibilidade)" },
        { action: "Bloqueio de descontos indevidos", description: "no benefício, quando identificados" },
        { action: "Liberação de margem consignada", description: "para reorganizar seu orçamento" },
        { action: "Recuperação de valores", description: "pagos indevidamente nos últimos 5 anos, quando cabível" },
        { action: "Atendimento 100% digital", description: "sem sair de casa, com orientação clara" },
        { action: "Compromisso com resultado", description: "para casos elegíveis (condições contratuais)" },
      ],
      beforeAfterTitle: "Antes / Depois (exemplo)",
      beforeLabel: "Antes",
      beforeRight: "Parcela alta",
      afterLabel: "Depois",
      afterRight: "Parcela reduzida",
      beforeBarPercent: 80,
      afterBarPercent: 40,
      footer:
        "Sem promessas irreais: atuamos com base no seu extrato e documentação. Resultados e prazos variam conforme o caso.",
    },
    testimonials: {
      ...base.testimonials,
      title: "Quem já conquistou sua liberdade financeira",
      testimonials: [
        {
          name: "Evaristo Neto",
          role: "Aposentado",
          text:
            "Como aposentado do INSS, eu tinha R$ 25.000 em dívidas consignadas descontando todo mês. Reduziram minhas parcelas em 55% e liberaram minha margem. Recomendo!",
          image: "/lovable-uploads/770f24ba-712b-48c6-8348-629c55780154.png",
        },
        {
          name: "Maria Santos",
          role: "Pensionista",
          text:
            "Em pouco tempo, organizaram meu caso e reduziram os descontos no meu benefício. Hoje recebo bem melhor e consigo pagar minhas contas com tranquilidade.",
          image: "/lovable-uploads/0159e8f4-d08a-4cc3-b6b5-99ffcd5ba296.png",
        },
        {
          name: "Carlos Oliveira",
          role: "Servidor público aposentado",
          text:
            "Profissionais sérios e transparentes. Reduzi parcelas e avancei para a quitação de dívidas que me preocupavam há anos. Atendimento ótimo do começo ao fim.",
          image: "/lovable-uploads/66607520-da93-457f-9540-627eb8234316.png",
        },
      ],
    },
    process: {
      ...base.process,
      title: "Como funciona em 3 passos simples",
      ctaLabel: "Quero uma análise gratuita do meu caso",
      steps: [
        {
          title: "Preencha o formulário",
          description:
            "Informe seus dados básicos e responda perguntas rápidas sobre seu benefício e consignados.",
        },
        {
          title: "Análise gratuita",
          description:
            "Nossa equipe analisa seu caso com base nas informações e, se necessário, solicita documentos para confirmar o cenário.",
        },
        {
          title: "Plano personalizado",
          description:
            "Se elegível, apresentamos um plano para reduzir parcelas, bloquear descontos indevidos e buscar a melhor estratégia de quitação.",
        },
      ],
    },
    faq: {
      ...base.faq,
      title: "Perguntas frequentes",
      items: [
        {
          question: "Como vocês conseguem reduzir meus descontos?",
          answer:
            "Analisamos seu extrato e a documentação do benefício para identificar descontos irregulares e aplicar medidas administrativas e/ou judiciais cabíveis para reduzir parcelas e bloquear abusos, quando houver base legal.",
        },
        {
          question: "Quanto tempo demora para ver resultados?",
          answer:
            "Em muitos casos, há avanços iniciais em 30 a 90 dias. O prazo depende da análise, documentação e do tipo de medida necessária.",
        },
        {
          question: "A análise é realmente grátis?",
          answer:
            "Sim. A triagem e a análise inicial são 100% gratuitas e sem compromisso. Só seguimos com assessoria mediante elegibilidade e aceite do plano.",
        },
        {
          question: "Preciso sair de casa?",
          answer:
            "Não. O atendimento é 100% digital (WhatsApp, e-mail e, se necessário, vídeo), com assinatura eletrônica e orientação passo a passo.",
        },
        {
          question: "E se não conseguirem reduzir parcelas ou avançar para quitação?",
          answer:
            "Trabalhamos com compromisso de resultado para casos elegíveis, com condições previstas em contrato. Cada caso é individual e depende de análise documental.",
        },
        {
          question: "Atendem servidor público estadual/federal?",
          answer:
            "Sim, atendemos aposentados de regimes próprios, desde que haja consignados descontados no benefício.",
        },
        {
          question: "Preciso pagar algo adiantado?",
          answer:
            "Não. O investimento na assessoria é apresentado após a análise e pode ser parcelado. Você decide com clareza antes de seguir.",
        },
        {
          question: "Como sei se meu caso é elegível?",
          answer:
            "Preencha o formulário. Em até 24h úteis, um especialista entra em contato para orientar os próximos passos da pré-análise.",
        },
      ],
    },
    finalCta: {
      ...base.finalCta,
      title: "Pronto para recuperar seu benefício INSS?",
      body:
        "Não deixe dívidas altas comprometerem sua aposentadoria. Faça uma análise gratuita e descubra se existe um caminho para reduzir parcelas, liberar margem e organizar a quitação.",
      ctaLabel: "Sim, quero recuperar minha margem consignada",
    },
  },
  "lp06": {
    ...base,
    hero: {
      ...base.hero,
      badge: "",
      eyebrow: "",
      headline:
        "Livre seu benefício dos descontos abusivos e volte a respirar em 30 dias ou menos.",
      subheadline:
        "Ajudamos aposentados, pensionistas e servidores a cortar cobranças ilegais, limpar o nome e recuperar a paz financeira — sem sair de casa.",
      ctaLabel: "Sim, quero recuperar minha margem",
      eligibilityNotice:
        "Sem custo agora. Seus dados ficam 100% seguros.",
      boosterText: "",
    },
    clarification: {
      mode: "eligibility",
      title: "Este serviço é para você?",
      intro:
        "Para garantir um atendimento rápido e eficaz, atendemos exclusivamente um perfil específico de consignado.",
      left: {
        title: "Sim — normalmente conseguimos ajudar quando:",
        bullets: [
          "Você é aposentado do INSS, pensionista do INSS ou servidor público aposentado",
          "Tem 55+ (ou 40–54 com dívidas altas de consignado)",
          "Seu benefício costuma ser acima de R$ 3.000 (prioridade)",
          "Suas dívidas de consignado somam mais de R$ 10.000 (ideal: acima de R$ 30.000)",
          "Você tem 2 ou mais empréstimos consignados ativos",
        ],
      },
      right: {
        title: "Não — vamos indicar outros caminhos se:",
        bullets: [
          "Você não é aposentado/pensionista/servidor público aposentado",
          "Seu benefício é até R$ 2.000",
          "Sua dívida de consignado é até R$ 10.000",
          "O problema é outro tipo de dívida (cartão, pessoal, etc.)",
        ],
      },
    },
    problem: {
      ...base.problem,
      badge: "O preço alto de não agir",
      title: "Quando o consignado passa do limite, a sua vida vira refém dos descontos",
      bullets: [
        "Descontos consignados que comprometem 40%, 50% ou até 80% do seu benefício",
        "Juros abusivos que só aumentam mês após mês",
        "Nome sujo que impede novas oportunidades e crédito",
        "Estresse constante e noites mal dormidas",
        "Dependência financeira dos filhos, mesmo após uma vida de trabalho",
      ],
      showCalculator: false,
      note:
        "Se você recebe mais de R$ 3.000 de benefício mas fica com menos da metade na mão, você não está sozinho.",
      closingLine:
        "Cada mês sem agir é mais dinheiro saindo do seu benefício.",
    },
    solution: {
      ...base.solution,
      title: "Uma solução simples, rápida e transparente",
      subtitle:
        "Nossa equipe especializada em direitos do aposentado analisa contratos de consignado e atua para proteger sua renda — sem você precisar sair de casa.",
      items: [
        { action: "Bloquear", description: "novos descontos ilegais no seu benefício" },
        { action: "Reduzir em até 90%", description: "as parcelas que você paga hoje (quando aplicável)" },
        { action: "Limpar seu nome", description: "dos órgãos de proteção ao crédito" },
        { action: "Devolver valores", description: "pagos indevidamente nos últimos 5 anos" },
      ],
      beforeAfterTitle: "Antes / Depois (exemplo)",
      beforeLabel: "Antes",
      beforeRight: "40% no bolso",
      afterLabel: "Depois",
      afterRight: "até 90% no bolso",
      beforeBarPercent: 40,
      afterBarPercent: 90,
      footer: "Processo 100% online, com acompanhamento personalizado do início ao fim.",
    },
    testimonials: {
      ...base.testimonials,
      title: "Quem já conquistou liberdade financeira",
      testimonials: [
        {
          name: "Evaristo Neto",
          role: "Aposentado do INSS",
          text: "Recuperei R$ 60 mil em descontos indevidos do meu consignado. Agora posso viver com dignidade.",
        },
        {
          name: "João Santos",
          role: "Pensionista do INSS",
          text: "Em 30 dias, quitaram R$ 55 mil das minhas dívidas de consignado. Recomendo!",
        },
        {
          name: "Ana Costa",
          role: "Servidora Pública Aposentada",
          text: "Profissionais sérios que realmente cumprem o que prometem. Recebi R$ 10.000 em indenização por abusos no meu consignado.",
        },
      ],
    },
    process: {
      title: "Como funciona em 3 passos simples",
      steps: [
        {
          title: "PREENCHA O FORMULÁRIO (2 min)",
          description: "Clique no botão e responda as perguntas para nossa equipe avaliar seu consignado.",
        },
        {
          title: "ANÁLISE GRATUITA",
          description: "Um especialista analisa seu caso, focando nos contratos e nos descontos do consignado.",
        },
        {
          title: "DINHEIRO NO CONTROLE",
          description: "Com a estratégia correta, você volta a ter renda na mão e o nome limpo — com acompanhamento digital.",
        },
      ],
      ctaLabel: "✅ QUERO MINHA ANÁLISE GRATUITA",
    },
    faq: {
      title: "Perguntas frequentes",
      items: [
        {
          question: "Como vocês podem reduzir meus descontos de consignado?",
          answer:
            "Atuamos na revisão de contratos de consignado, identificando abusos como juros excessivos, descontos acima do permitido e outras irregularidades. Com base na lei, negociamos com os bancos para reduzir o valor das parcelas e, quando cabível, recuperar valores pagos a mais.",
        },
        {
          question: "Quanto tempo demora para ver resultados?",
          answer:
            "Em média, em 30 a 60 dias já é possível ver uma redução significativa nos descontos. O processo completo pode levar de 3 a 6 meses, dependendo da complexidade do caso.",
        },
        {
          question: "É realmente grátis a análise?",
          answer:
            "Sim. A análise inicial é 100% gratuita. Só apresentamos custos após entender o caso e você ter clareza do caminho — você decide se quer seguir.",
        },
        {
          question: "Preciso sair de casa?",
          answer:
            "Não. Todo o processo é feito online, por WhatsApp, telefone e e-mail. Você não precisa ir a nenhum escritório.",
        },
        {
          question: "E se não conseguirem me ajudar?",
          answer:
            "Se a análise indicar que não há irregularidades ou que não há ganho possível, informamos com transparência. Nessa situação, você não paga nada.",
        },
        {
          question: "Vocês atendem apenas aposentados?",
          answer:
            "Sim. Somos especializados em aposentados, pensionistas do INSS e servidores públicos aposentados com dívidas de consignado. Não atendemos outros perfis ou tipos de dívida.",
        },
      ],
    },
    finalCta: {
      ...base.finalCta,
      title: "Não deixe mais um mês passar perdendo dinheiro com descontos abusivos",
      body:
        "Cada dia que passa sem agir é dinheiro que sai do seu bolso. Milhares de aposentados e pensionistas já recuperaram sua dignidade financeira.\n\nNossa missão é simples: devolver o controle do seu dinheiro para você.",
      ctaLabel: "🚀 SIM, QUERO RECUPERAR MINHA RENDA AGORA",
      microcopy:
        "✅ 100% Garantido • ✅ Atendimento imediato • ✅ Dados 100% seguros • ✅ Sem compromisso",
    },
  },
  "lp07": {
    ...base,
    hero: {
      ...base.hero,
      badge: "Você sofre com descontos que levam quase todo o seu benefício?",
      eyebrow: "",
      headline:
        "Livre seu benefício dos descontos abusivos e volte a respirar em 30 dias ou menos.",
      subheadline:
        "Ajudamos aposentados, pensionistas e servidores a cortar cobranças ilegais, limpar o nome e recuperar a paz financeira — sem sair de casa.",
      ctaLabel: "Sim, quero recuperar minha margem",
      ctaMicrocopy: "Sem custo agora. Seus dados ficam 100% seguros.",
      boosterText: "",
      showTrustBar: true,
      showGuaranteeStamp: true,
    },
    problem: {
      ...base.problem,
      badge: "+ de 30 mil clientes",
      title: "O preço alto de não agir",
      bullets: [
        "Descontos consignados que consomem até 80% do benefício",
        "Juros abusivos que só aumentam mês após mês",
        "Nome sujo que impede novas oportunidades",
        "Estresse constante e noites mal dormidas",
        "Dependência financeira dos filhos",
      ],
      showCalculator: false,
    },
    solution: {
      ...base.solution,
      title: "A nova maneira de resolver",
      subtitle: "Simples. Rápido. Transparente.",
      items: [
        { action: "Bloqueamos", description: "novos descontos ilegais no seu benefício" },
        {
          action: "Reduzimos em até 90%",
          description: "as parcelas que você paga hoje",
        },
        {
          action: "Limpamos seu nome",
          description: "dos órgãos de proteção ao crédito",
        },
        {
          action: "Devolvemos valores",
          description: "pagos indevidamente nos últimos 5 anos",
        },
      ],
      badgeLeft: "",
      badgeRight: "",
      beforeAfterTitle: "",
      beforeLabel: "",
      beforeRight: "",
      afterLabel: "",
      afterRight: "",
      beforeBarPercent: 0,
      afterBarPercent: 0,
      footer: "",
    },
    testimonials: {
      ...base.testimonials,
      title: "Quem já conquistou sua liberdade",
      testimonials: [
        {
          name: "Evaristo Neto",
          role: "Aposentado",
          text: "Recuperei R$ 60 mil em descontos indevidos. Agora posso viver com dignidade.",
          image: "/lovable-uploads/770f24ba-712b-48c6-8348-629c55780154.png",
        },
        {
          name: "João Santos",
          role: "Pensionista",
          text: "Em 30 dias quitaram R$ 55 mil das minhas dívidas de consignado. Recomendo!",
          image: "/lovable-uploads/66607520-da93-457f-9540-627eb8234316.png",
        },
        {
          name: "Ana Costa",
          role: "Servidora pública",
          text: "Profissionais sérios que realmente cumprem o que prometem. Recebi R$ 10.000 em indenização por abusos em meu consignado.",
          image: "/lovable-uploads/0159e8f4-d08a-4cc3-b6b5-99ffcd5ba296.png",
        },
      ],
    },
    process: {
      ...base.process,
      title: "Como funciona em 3 passos simples",
      steps: [
        {
          title: "Clique",
          description: "Preencha o formulário com seus dados básicos",
        },
        {
          title: "Análise",
          description: "Nossa equipe analisa seu caso gratuitamente",
        },
        {
          title: "Salário livre",
          description: "Você volta a ter controle total do seu dinheiro",
        },
      ],
    },
    benefitsList: {
      title: "Por que escolher nossa ajuda",
      items: [
        {
          title: "Analisamos Gratuitamente Seu Caso",
          description: "Análise completa e gratuita do seu caso",
        },
        {
          title: "Sempre ao Seu Lado",
          description: "Acompanhamento personalizado durante todo processo",
        },
        {
          title: "Trabalhando por Você!",
          description: "Equipe especializada em direito previdenciário",
        },
        {
          title: "Vitória Garantida ou Seu Dinheiro de Volta",
          description: "Resultados garantidos ou seu dinheiro de volta",
        },
        {
          title: "Atendimento 100% digital, sem sair de casa",
          description: "Atendimento 100% digital, sem sair de casa",
        },
      ],
    },
    faq: {
      ...base.faq,
      items: [
        {
          question: "Como vocês podem reduzir meus descontos?",
          answer:
            "Através de análise jurídica especializada, identificamos cobranças ilegais e pressionamos diretamente os bancos para reduzir ou eliminar os descontos abusivos",
        },
        {
          question: "Quanto tempo demora para ver resultados?",
          answer:
            "Geralmente entre 15 a 30 dias úteis você já começa a ver os primeiros resultados, com a redução ou bloqueio dos descontos",
        },
        {
          question: "É realmente grátis a análise?",
          answer:
            "Sim, a análise do seu caso é 100% gratuita e sem compromisso. Você só paga se decidir prosseguir com nossos serviços",
        },
        {
          question: "Preciso sair de casa?",
          answer:
            "Não! Todo o processo é 100% digital. Você resolverá tudo pelo WhatsApp",
        },
        {
          question: "E se não conseguirem me ajudar?",
          answer:
            "Oferecemos garantia de resultado. Se não conseguirmos reduzir seus descontos, você não paga nada",
        },
      ],
    },
    finalCta: {
      ...base.finalCta,
      title: "Pronto para recuperar seu salário?",
      body:
        "Não deixe mais um mês passar perdendo dinheiro com descontos abusivos. Sua análise gratuita está a um clique de distância",
      ctaLabel: "Sim, quero recuperar minha margem",
      microcopy:
        "Atendimento imediato • Dados 100% seguros • Sem compromisso",
      footerIdentificationLines: [
        "Cada dia que passa sem agir é dinheiro que sai do seu bolso. Milhares de aposentados e pensionistas já recuperaram sua dignidade financeira",
        "Na Meu Nome Ok, nossa missão é simples: devolver o controle do seu dinheiro para você",
      ],
      footerDisclaimer:
        "P.S.: Os bancos contam com sua inércia para continuar lucrando. Não deixe isso acontecer mais um dia sequer",
    },
  },
  "lp08": {
    ...base,
    hero: {
      ...base.hero,
      badge: "Você sofre com descontos que levam quase todo o seu benefício?",
      eyebrow: "",
      headline:
        "Livre seu benefício dos descontos abusivos e volte a respirar em 30 dias ou menos.",
      subheadline:
        "Ajudamos aposentados, pensionistas e servidores a cortar cobranças ilegais, limpar o nome e recuperar a paz financeira — sem sair de casa.",
      ctaLabel: "Sim, quero recuperar minha margem",
      ctaMicrocopy: "Sem custo agora. Seus dados ficam 100% seguros.",
      boosterText: "",
      showTrustBar: true,
      showGuaranteeStamp: true,
    },
    problem: {
      ...base.problem,
      badge: "+ de 30 mil clientes",
      title: "O preço alto de não agir",
      bullets: [
        "Descontos consignados que consomem até 80% do benefício",
        "Juros abusivos que só aumentam mês após mês",
        "Nome sujo que impede novas oportunidades",
        "Estresse constante e noites mal dormidas",
        "Dependência financeira dos filhos",
      ],
      showCalculator: false,
    },
    solution: {
      ...base.solution,
      title: "A nova maneira de resolver",
      subtitle: "Simples. Rápido. Transparente.",
      items: [
        { action: "Bloqueamos", description: "novos descontos ilegais no seu benefício" },
        {
          action: "Reduzimos em até 90%",
          description: "as parcelas que você paga hoje",
        },
        {
          action: "Limpamos seu nome",
          description: "dos órgãos de proteção ao crédito",
        },
        {
          action: "Devolvemos valores",
          description: "pagos indevidamente nos últimos 5 anos",
        },
      ],
      badgeLeft: "",
      badgeRight: "",
      beforeAfterTitle: "",
      beforeLabel: "",
      beforeRight: "",
      afterLabel: "",
      afterRight: "",
      beforeBarPercent: 0,
      afterBarPercent: 0,
      footer: "",
    },
    testimonials: {
      ...base.testimonials,
      title: "Quem já conquistou sua liberdade",
      testimonials: [
        {
          name: "Evaristo Neto",
          role: "Aposentado",
          text: "Recuperei R$ 60 mil em descontos indevidos. Agora posso viver com dignidade.",
          image: "/lovable-uploads/770f24ba-712b-48c6-8348-629c55780154.png",
        },
        {
          name: "João Santos",
          role: "Pensionista",
          text: "Em 30 dias quitaram R$ 55 mil das minhas dívidas de consignado. Recomendo!",
          image: "/lovable-uploads/66607520-da93-457f-9540-627eb8234316.png",
        },
        {
          name: "Ana Costa",
          role: "Servidora pública",
          text: "Profissionais sérios que realmente cumprem o que prometem. Recebi R$ 10.000 em indenização por abusos em meu consignado.",
          image: "/lovable-uploads/0159e8f4-d08a-4cc3-b6b5-99ffcd5ba296.png",
        },
      ],
    },
    process: {
      ...base.process,
      title: "Como funciona em 3 passos simples",
      steps: [
        {
          title: "Clique",
          description: "Preencha o formulário com seus dados básicos",
        },
        {
          title: "Análise",
          description: "Nossa equipe analisa seu caso gratuitamente",
        },
        {
          title: "Salário livre",
          description: "Você volta a ter controle total do seu dinheiro",
        },
      ],
    },
    benefitsList: {
      title: "Por que escolher nossa ajuda",
      items: [
        {
          title: "Analisamos Gratuitamente Seu Caso",
          description: "Análise completa e gratuita do seu caso",
        },
        {
          title: "Sempre ao Seu Lado",
          description: "Acompanhamento personalizado durante todo processo",
        },
        {
          title: "Trabalhando por Você!",
          description: "Equipe especializada em direito previdenciário",
        },
        {
          title: "Vitória Garantida ou Seu Dinheiro de Volta",
          description: "Resultados garantidos ou seu dinheiro de volta",
        },
        {
          title: "Atendimento 100% digital, sem sair de casa",
          description: "Atendimento 100% digital, sem sair de casa",
        },
      ],
    },
    faq: {
      ...base.faq,
      items: [
        {
          question: "Como vocês podem reduzir meus descontos?",
          answer:
            "Através de análise jurídica especializada, identificamos cobranças ilegais e pressionamos diretamente os bancos para reduzir ou eliminar os descontos abusivos",
        },
        {
          question: "Quanto tempo demora para ver resultados?",
          answer:
            "Geralmente entre 15 a 30 dias úteis você já começa a ver os primeiros resultados, com a redução ou bloqueio dos descontos",
        },
        {
          question: "É realmente grátis a análise?",
          answer:
            "Sim, a análise do seu caso é 100% gratuita e sem compromisso. Você só paga se decidir prosseguir com nossos serviços",
        },
        {
          question: "Preciso sair de casa?",
          answer:
            "Não! Todo o processo é 100% digital. Você resolverá tudo pelo WhatsApp",
        },
        {
          question: "E se não conseguirem me ajudar?",
          answer:
            "Oferecemos garantia de resultado. Se não conseguirmos reduzir seus descontos, você não paga nada",
        },
      ],
    },
    finalCta: {
      ...base.finalCta,
      title: "Pronto para recuperar seu salário?",
      body:
        "Não deixe mais um mês passar perdendo dinheiro com descontos abusivos. Sua análise gratuita está a um clique de distância",
      ctaLabel: "Sim, quero recuperar minha margem",
      microcopy:
        "Atendimento imediato • Dados 100% seguros • Sem compromisso",
      footerIdentificationLines: [
        "Cada dia que passa sem agir é dinheiro que sai do seu bolso. Milhares de aposentados e pensionistas já recuperaram sua dignidade financeira",
        "Na Meu Nome Ok, nossa missão é simples: devolver o controle do seu dinheiro para você",
      ],
      footerDisclaimer:
        "P.S.: Os bancos contam com sua inércia para continuar lucrando. Não deixe isso acontecer mais um dia sequer",
    },
  },
};

export const getLandingVariant = (key: string | undefined): LandingCopy => {
  const normalized = (() => {
    if (!key) return "lp01";
    const match = key.match(/^lp-?(0[1-8])$/);
    if (!match) return "lp01";
    return `lp${match[1]}`;
  })();

  return landingVariants[normalized] ?? landingVariants["lp01"];
};
