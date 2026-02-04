# Design — Remover triagem de renda na LP10

## Contexto
A LP10 foi ativada como cópia da LP09, incluindo triagem de renda e etapa de termos. O usuário pediu para remover a triagem de renda, mantendo apenas a triagem inicial (situação) e a etapa de consentimento (termos).

## Objetivo
Eliminar a pergunta de renda da LP10 e não enviar `Renda mensal aproximada` no payload, mantendo o fluxo: situação → termos → formulário (ou desqualificação).

## Escopo das mudanças
- `src/forms/lead/variants/lp10.tsx`
  - Remover tipos/estado e renderização da etapa `income`.
  - Ajustar o fluxo para ir de `qualify` direto para `terms` (quando Aposentado/Servidor).
  - Remover envio de `incomeRange` no payload.
  - Ajustar mensagens de desqualificação para somente `clt` e `terms_declined`.

## Fluxo final
1. **Qual sua situação?**
   - Aposentado / Servidor público → termos.
   - CLT → desqualificado.
2. **Termos**
   - ACEITO → formulário.
   - NÃO ACEITO → desqualificado.

## Riscos e validações
- Risco baixo, alteração isolada na LP10.
- Validar manualmente:
  - `/lp10` → Aposentado/Servidor → termos → ACEITO → formulário.
  - `/lp10` → Aposentado/Servidor → termos → NÃO ACEITO → desqualifica.
  - `/lp10` → CLT → desqualifica.
  - Payload não inclui `Renda mensal aproximada`.
