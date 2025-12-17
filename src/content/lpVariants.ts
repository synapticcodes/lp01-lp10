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
  documentsBody?: string;
  documentsBullets?: string[];
  documentsWarning?: string;
  showGuaranteeStamp?: boolean;
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
  problem: ProblemCopy;
  solution: SolutionCopy;
  testimonials: TestimonialsCopy;
  process: ProcessCopy;
  faq: FaqCopy;
  finalCta: FinalCtaCopy;
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
  "lp01": base,
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
      showTrustBar: false,
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
      headline: "Aposentado ou pensionista do INSS? Reduza juros abusivos e proteja seu benefício.",
    },
  },
  "lp04": {
    ...base,
    hero: {
      ...base.hero,
      headline: "Descontos no benefício do INSS te sufocando? Podemos ajudar a recuperar sua tranquilidade financeira.",
    },
  },
  "lp05": {
    ...base,
    hero: {
      ...base.hero,
      headline: "Se você recebe INSS e tem descontos, faça uma análise gratuita do seu caso agora.",
      subheadline:
        "Atendimento humano e paciente: ajudamos aposentados e pensionistas do INSS a revisar descontos, reduzir abusos e organizar a vida financeira sem sair de casa.",
    },
  },
  "lp06": {
    ...base,
    hero: {
      ...base.hero,
      headline: "Aposentado do INSS: pare de perder dinheiro todo mês com descontos que podem ser ilegais.",
    },
  },
  "lp07": {
    ...base,
    hero: {
      ...base.hero,
      headline: "INSS: quando o desconto é abusivo, a lei pode ajudar a reduzir ou bloquear.",
    },
  },
  "lp08": {
    ...base,
    hero: {
      ...base.hero,
      headline: "Aposentado/pensionista do INSS: descubra se você tem direito a revisar descontos no benefício.",
    },
  },
  "lp09": {
    ...base,
    hero: {
      ...base.hero,
      headline: "Seu benefício do INSS está vindo menor por descontos? Entenda suas opções com uma análise gratuita.",
    },
  },
  "lp10": {
    ...base,
    hero: {
      ...base.hero,
      headline: "Aposentado do INSS: recupere o controle do seu benefício com um passo a passo simples.",
      ctaLabel: "Quero verificar meu caso",
    },
    finalCta: {
      ...base.finalCta,
      ctaLabel: "Quero verificar meu caso",
    },
  },
};

export const getLandingVariant = (key: string | undefined): LandingCopy => {
  const normalized = (() => {
    if (!key) return "lp01";
    const match = key.match(/^lp-?(0[1-9]|10)$/);
    if (!match) return "lp01";
    return `lp${match[1]}`;
  })();

  return landingVariants[normalized] ?? landingVariants["lp01"];
};
