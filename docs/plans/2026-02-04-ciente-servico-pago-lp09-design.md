# Design — Flag “serviço pago” no payload da LP09

## Contexto
A LP09 inclui uma etapa de termos antes do formulário. O usuário pediu que o payload enviado para o backend também registre a mensagem "Estou ciente que o serviço é pago" junto com os demais dados.

## Objetivo
Incluir no payload do lead um campo indicando a ciência de que o serviço é pago, somente na LP09 (que já exige o aceite dos termos).

## Escopo das mudanças
- `src/forms/lead/variants/lp09.tsx`: adicionar `paidServiceAcknowledgement` no `submitLead`.
- `src/hooks/useAirtableSubmission.ts`: mapear o novo dado para o campo `"Ciente que o serviço é pago"`.

## Fluxo
- Após o aceite dos termos e envio do formulário, o payload inclui:
  - `paidServiceAcknowledgement: "Estou ciente que o serviço é pago"`.

## Riscos e validações
- Risco baixo; mudança aditiva.
- Validar manualmente que o payload enviado contém o novo campo.
