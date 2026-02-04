# Design — Ativar LP09 como cópia da LP08

## Contexto
A LP08 foi ativada como cópia da LP07 e recebeu uma triagem adicional de renda. O usuário solicitou ativar a LP09 como uma cópia exata da LP08, para edição independente.

## Objetivo
Ativar `lp09` com o mesmo comportamento da `lp08` (copy, rotas, formulário e triagem de renda), mantendo `lp08` intacta.

## Escopo das mudanças
1. **Rotas e redirects**
   - Router: incluir `lp09` nos arrays de chaves (`LP_KEYS`, `LEGACY_LP_KEYS`) e remover redirect interno `/lp09` → `/lp06`.
   - Netlify: remover redirect `/lp09` → `/lp06` e ajustar `/lp-09` → `/lp09`.

2. **Copy**
   - Criar a entrada `"lp09"` em `src/content/lpVariants.ts` como cópia literal de `"lp08"`.
   - Ajustar `getLandingVariant()` para aceitar `lp09`.

3. **Formulário**
   - Criar `src/forms/lead/variants/lp09.tsx` como cópia de `lp08.tsx` (incluindo triagem de renda e payload `incomeRange`).
   - Atualizar `LeadFormVariantKey` e `leadFormVariants`.
   - Ajustar regex de roteamento do form para aceitar `lp09`.

4. **Back button redirect**
   - Atualizar regex para incluir `lp09`.

## Fluxo
- O fluxo de triagem e formulário da LP09 é idêntico ao da LP08.
- Leads enviados incluem `incomeRange` com rótulo legível.

## Riscos e validações
- Risco baixo; mudanças isoladas.
- Validar manualmente:
  - `/lp09` e `/lp-09` funcionam corretamente.
  - Triagem de renda se comporta igual à LP08.
