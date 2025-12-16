# Manifesto do Projeto — Landing Pages lp01…lp10

## 1) Objetivo final

Construir e manter **10 variações de landing pages** no mesmo site (Netlify), com URLs estáveis:

- `/lp01` … `/lp10` (slugs principais)
- Compatibilidade com slugs antigos: `/lp-01` … `/lp-10` (redirecionados)

Cada variação deve permitir:

- **Copy diferente** (headline, CTA, textos por seção)
- **Formulário exclusivo por variante** (cada LP pode ter seu próprio fluxo/campos)
- **Mesma base de layout e componentes**, para não “quebrar” o sistema e manter consistência

O público-alvo e a linguagem foram ajustados para **aposentados/pensionistas do INSS (55+)**, com foco em clareza, acessibilidade e confiança.

---

## 2) Stack e arquitetura

- **Vite + React + TypeScript**
- **React Router** para rotas SPA
- **Tailwind + shadcn/ui** para UI
- **Netlify** (redirects + SPA fallback)
- Integrações:
  - **GTM** no `index.html`
  - **Airtable** para envio de leads (via env vars)
  - **Validação WhatsApp** opcional (via env vars)

Arquitetura prática:

- **Páginas** ficam em `src/pages/`
- **Seções** (Hero, FAQ etc.) ficam em `src/components/sections/`
- **Conteúdo/variantes** ficam em `src/content/lpVariants.ts`
- **Formulários** ficam em `src/forms/lead/` e o diálogo em `src/components/ui/LeadFormDialog.tsx`

---

## 3) Como as rotas das LPs funcionam (lp01…lp10)

O roteamento foi implementado para garantir que cada slug carregue a variante correta.

Arquivos envolvidos:

- [src/App.tsx](src/App.tsx)
  - Declara rotas explícitas para `/lp01`…`/lp10`.
  - Mantém suporte/redirect para `/lp-01`…`/lp-10`.
  - Mantém outras rotas: `/obrigado` (ThankYou) e `/ultima-chance` (BackRedirect).

- [netlify.toml](netlify.toml)
  - Build: `npm run build` e publish: `dist`
  - Redirects:
    - `/` → `/lp01`
    - `/lp-01`…`/lp-10` → `/lp01`…`/lp10` (301)
  - SPA fallback:
    - `/*` → `/index.html` (200)

Por que isso existe?

- O Netlify precisa dos redirects para **não dar 404** em rotas SPA.
- Os redirects legados evitam perda de tráfego e links quebrados.

---

## 4) Como o sistema de variantes de copy funciona

A copy das 10 LPs fica centralizada em:

- [src/content/lpVariants.ts](src/content/lpVariants.ts)

Pontos-chave:

- Existe um objeto base (`base`) que define a copy padrão.
- `landingVariants` contém as entradas `lp01`…`lp10` sobrescrevendo apenas o que muda.
- `getLandingVariant(key)` normaliza a chave e garante fallback seguro para `lp01`.

Onde o conteúdo é aplicado:

- [src/pages/Landing.tsx](src/pages/Landing.tsx)
  - Obtém `copy = getLandingVariant(variantKey)`.
  - Passa a copy por seção:
    - `<HeroSection copy={copy.hero} />`
    - `<ProblemSection copy={copy.problem} />`
    - `<SolutionSection copy={copy.solution} />`
    - `<TestimonialsSection copy={copy.testimonials} />`
    - `<ProcessSection copy={copy.process} />`
    - `<FAQSection copy={copy.faq} />`
    - `<FinalCTASection copy={copy.finalCta} />`
  - O CTA fixo inferior usa `copy.hero.ctaLabel`.

Como editar uma variante (exemplo rápido):

1. Abra [src/content/lpVariants.ts](src/content/lpVariants.ts)
2. Edite o bloco de `lp0X` desejado:
   - `hero.headline`
   - `hero.subheadline`
   - `hero.ctaLabel`
   - ou outras seções (`problem`, `solution`, `faq`, etc.)
3. Não precisa mexer em rotas para atualizar copy.

---

## 5) Formulário exclusivo por variante (lp01…lp10)

O modal de lead foi transformado em um “shell” que escolhe o formulário certo baseado na URL.

Arquivos principais:

- [src/components/ui/LeadFormDialog.tsx](src/components/ui/LeadFormDialog.tsx)
  - Detecta `location.pathname` e renderiza o componente correto via registry.

- [src/forms/lead/registry.ts](src/forms/lead/registry.ts)
  - Mapeia `lp01…lp10` → componente do formulário
  - Funções importantes:
    - `getLeadFormVariantFromPath(pathname)` (suporta `/lp01` e `/lp-01`)
    - `getLeadFormComponentForPath(pathname)`

- [src/forms/lead/variants/](src/forms/lead/variants)
  - Um arquivo por LP:
    - `lp01.tsx` … `lp10.tsx`
  - Hoje, todos delegam para o formulário padrão. Para tornar “exclusivo”, basta editar o arquivo da variante.

- [src/forms/lead/DefaultLeadFormDialogContent.tsx](src/forms/lead/DefaultLeadFormDialogContent.tsx)
  - Conteúdo padrão (fluxo + validações + envio).
  - Implementa:
    - Etapas de qualificação
    - Validações de nome/e-mail/telefone
    - Validação WhatsApp (opcional)
    - Envio ao Airtable
    - Proteção: se já enviou (`localStorage.leadSubmitted`) evita reenvio

**Como criar um formulário realmente diferente em lp07, por exemplo:**

- Edite [src/forms/lead/variants/lp07.tsx](src/forms/lead/variants/lp07.tsx)
- Em vez de retornar o default, implemente um componente próprio (mantendo `LeadFormVariantProps`).

---

## 6) Redirecionamento ao apertar “voltar” (última chance)

Existe um comportamento para reduzir abandono: se o usuário tenta voltar sem enviar lead, redireciona para `/ultima-chance`.

Arquivo:

- [src/hooks/useBackButtonRedirect.ts](src/hooks/useBackButtonRedirect.ts)

Pontos importantes:

- Só aplica em rotas `/lp01..lp10` e `/lp-01..lp-10`.
- Se `localStorage.leadSubmitted` não estiver setado, redireciona.

---

## 7) Integrações e variáveis de ambiente (NÃO colocar tokens no código)

Env vars (Vite) esperadas:

- `VITE_AIRTABLE_TOKEN` (obrigatória)
- `VITE_AIRTABLE_BASE_ID` (obrigatória)
- `VITE_AIRTABLE_TABLE_NAME` (opcional, default `Leads`)
- `VITE_WHATSAPP_VALIDATOR_APIKEY` (opcional)
- `VITE_WHATSAPP_VALIDATOR_URL` (opcional)

Arquivos relevantes:

- [src/hooks/useAirtableSubmission.ts](src/hooks/useAirtableSubmission.ts)
  - Lê tokens via `import.meta.env.*`
  - Se faltar config, falha de forma controlada (toast e retorno `false`).

- [src/hooks/useWhatsappValidation.ts](src/hooks/useWhatsappValidation.ts)
  - Se não houver `VITE_WHATSAPP_VALIDATOR_APIKEY`, a validação é ignorada (não bloqueia o fluxo).

Regras:

- **Nunca** hardcodar tokens/keys no repositório.
- `.env` deve ficar fora do Git.

---

## 8) Tracking

- Mantivemos **apenas Google Tag Manager**.

Arquivo:

- [index.html](index.html)

---

## 9) Onde mexer (recomendado)

### Variantes de copy

- [src/content/lpVariants.ts](src/content/lpVariants.ts)
  - Principal lugar para alterar headlines, CTAs e textos por seção para `lp01…lp10`.

### Estrutura/ordem de seções

- [src/pages/Landing.tsx](src/pages/Landing.tsx)
  - Dá para reorganizar seções, mas faça com cuidado.

### Componentes de seções

- `src/components/sections/*`
  - Para alterar layout/UX de uma seção específica.

### Formulário por LP

- `src/forms/lead/variants/lp01.tsx` … `lp10.tsx`
  - Para customizar conteúdo/fluxo por variante.

---

## 10) Arquivos “não mexer” (ou mexer com MUITA cautela)

Esses arquivos são o “esqueleto” do sistema. Alterações erradas costumam quebrar rotas, variantes, deploy ou captação.

- [src/App.tsx](src/App.tsx)
  - Se mexer nas rotas/ordem, pode voltar 404, ou carregar variante errada.

- [netlify.toml](netlify.toml)
  - Se remover SPA fallback, Netlify volta a dar 404 nas rotas.
  - Se mexer nos redirects, pode quebrar `/lp01..lp10` ou legado `/lp-01..lp-10`.

- [src/forms/lead/registry.ts](src/forms/lead/registry.ts)
  - Se quebrar regex/mapping, o modal pode renderizar formulário errado (ou cair no default sempre).

- [src/components/ui/LeadFormDialog.tsx](src/components/ui/LeadFormDialog.tsx)
  - É o “router” do formulário; mudanças podem impedir o modal de funcionar.

- [src/hooks/useBackButtonRedirect.ts](src/hooks/useBackButtonRedirect.ts)
  - Se quebrar a regex, pode ativar redirecionamento em páginas indevidas ou desativar em LPs.

- [src/hooks/useAirtableSubmission.ts](src/hooks/useAirtableSubmission.ts)
  - Evite alterações sem testar; é crítico para conversão.

- [index.html](index.html)
  - Mudanças em scripts/medição podem quebrar tracking.

---

## 11) Checklist rápido para editar uma LP sem quebrar nada

- Quero mudar headline/CTA/textos → edite [src/content/lpVariants.ts](src/content/lpVariants.ts)
- Quero um formulário diferente para `lp0X` → edite `src/forms/lead/variants/lp0X.tsx`
- Quero mudar redirects/URLs → edite [netlify.toml](netlify.toml) (com MUITO cuidado)
- Quero alterar ordem de seções → edite [src/pages/Landing.tsx](src/pages/Landing.tsx)

---

## 12) Estado atual (o que já está pronto)

- 10 LPs com slugs estáveis (`/lp01..lp10`) + compatibilidade com slugs antigos (`/lp-01..lp-10`).
- Copy centralizada com fallback seguro (`getLandingVariant`).
- Formulário por variante com registry e placeholders prontos para customização.
- Deploy Netlify com redirects e SPA fallback.
- Tokens removidos do código e migrados para env vars.

---

## 13) Observação importante sobre “fonte de verdade”

Na prática, a pasta que está conectada ao GitHub/Netlify (e onde as mudanças devem ser feitas) é a que:

- aponta o `origin` para `https://github.com/synapticcodes/lp01-lp10.git`
- tem a pasta `.netlify/` com o `state.json` do site

Se você estiver editando outra cópia (por exemplo, uma antiga), suas mudanças não entram no deploy automático.
