export type LpVariantId = `lp${string}`;

export interface HeroCopy {
  badge: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
}

export interface FinalCtaCopy {
  title: string;
  body: string;
  ctaLabel: string;
}

export interface ProblemCopy {
  badge: string;
  title: string;
  bullets: string[];
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
}

export interface ProcessStepCopy {
  title: string;
  description: string;
}

export interface ProcessCopy {
  title: string;
  steps: ProcessStepCopy[];
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
      ...base.hero,
      headline: "Aposentado do INSS? Veja como bloquear descontos abusivos no seu benefício em até 30 dias.",
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
