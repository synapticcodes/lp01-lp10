# Design — Ativar LP08 como cópia da LP07

## Contexto
Hoje o projeto mantém LPs ativas de `lp01` a `lp07`. As rotas `/lp08`, `/lp09` e `/lp10` estão redirecionando para `/lp06`, e não existe variante de copy nem formulário próprios para `lp08`. O usuário solicitou ativar a `lp08` como uma cópia exata da `lp07`, para poder editar a partir daí sem afetar a `lp07`.

## Objetivo
Ativar a LP08 com comportamento idêntico à LP07 (copy, formulário e fluxos), mantendo a LP07 intacta e permitindo edição independente da LP08 no futuro.

## Escopo das mudanças
1. **Rotas e redirects**
   - Router: incluir `lp08` em `LP_KEYS` e em rotas/legacy. Remover o redirect interno `/lp08` → `/lp06`.
   - Netlify: remover o redirect `/lp08` → `/lp06` e ajustar `/lp-08` → `/lp08`.

2. **Copy**
   - Criar entrada `"lp08"` em `src/content/lpVariants.ts` como cópia literal de `"lp07"`.
   - Ajustar `getLandingVariant()` para aceitar `lp08`.

3. **Formulário**
   - Criar `src/forms/lead/variants/lp08.tsx` como cópia de `lp07`.
   - Atualizar o tipo `LeadFormVariantKey` e o registro de variantes em `src/forms/lead/registry.ts`.
   - Ajustar regex de identificação para aceitar `lp08`.

4. **Back button redirect**
   - Atualizar regex em `useBackButtonRedirect` para incluir `lp08`.

## Fluxos
- A `lp08` seguirá o mesmo fluxo da `lp07`: triagem simples, desqualificação para CLT, formulário com `name/email/phone` e envio via `useAirtableSubmission`.
- A experiência pós-envio se mantém: redirecionamento pela `redirect_url` do backend quando presente; caso contrário, `/obrigado`.

## Riscos e validações
- Risco baixo, mudanças isoladas e idênticas à LP07.
- Validar em ambiente local:
  - `/lp08` renderiza a copy correta.
  - `/lp-08` redireciona para `/lp08`.
  - Formulário abre e envia como na `lp07`.
  - Back button redirect funciona em `/lp08`.
