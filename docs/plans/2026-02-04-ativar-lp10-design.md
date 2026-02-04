# Design — Ativar LP10 como cópia da LP09

## Contexto
A LP09 é uma cópia da LP08 e possui triagem de renda e aceite de termos. O usuário solicitou ativar a LP10 como cópia exata da LP09 para permitir edição independente.

## Objetivo
Ativar `lp10` com o mesmo comportamento da `lp09` (copy, rotas, formulário e triagens), mantendo `lp09` intacta.

## Escopo das mudanças
1. **Rotas e redirects**
   - Router: incluir `lp10` nos arrays de chaves e remover redirect interno `/lp10` → `/lp06`.
   - Netlify: remover redirect `/lp10` → `/lp06` e ajustar `/lp-10` → `/lp10`.

2. **Copy**
   - Criar a entrada `"lp10"` em `src/content/lpVariants.ts` como cópia literal de `"lp09"`.
   - Ajustar `getLandingVariant()` para aceitar `lp10`.

3. **Formulário**
   - Criar `src/forms/lead/variants/lp10.tsx` como cópia de `lp09.tsx` (incluindo triagem de renda, termos e payload de ciência do serviço pago).
   - Atualizar `LeadFormVariantKey` e `leadFormVariants`.
   - Ajustar regex de roteamento do form para aceitar `lp10`.

4. **Back button redirect**
   - Atualizar regex para incluir `lp10`.

## Fluxo
- O fluxo de triagem e formulário da LP10 é idêntico ao da LP09.
- Leads enviados incluem `incomeRange` e `paidServiceAcknowledgement`.

## Riscos e validações
- Risco baixo; mudanças isoladas.
- Validar manualmente:
  - `/lp10` e `/lp-10` funcionam corretamente.
  - Triagens e aceite de termos iguais à LP09.
