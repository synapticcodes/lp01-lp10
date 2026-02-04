# Design — Passo de termos na triagem da LP09

## Contexto
A LP09 é uma cópia da LP08, que já possui triagem de renda. O usuário solicitou adicionar um passo adicional de consentimento antes do formulário de lead, informando custos e condições do serviço jurídico.

## Objetivo
Inserir uma tela de termos após a triagem de renda (quando a renda é >= R$ 3.000). O usuário deve aceitar para continuar ao formulário; se recusar, é desqualificado.

## Escopo das mudanças
- Arquivo único: `src/forms/lead/variants/lp09.tsx`.
- Novo passo no fluxo: `terms`.
- Novo motivo de desqualificação: `terms_declined`.

## Fluxo
1. Qualify (situação) → renda →
2. Se renda >= R$ 3.000 → **termos** →
3. ACEITO → formulário.
4. NÃO ACEITO → desqualificação com mensagem “encerramos por aqui, sem compromisso”.

## Conteúdo da tela de termos
- Aviso de que é um serviço jurídico com custos.
- Lista de declarações sobre não-gratuidade, condição de contrato/pagamento e proteção do contrato.
- CTAs: **ACEITO** (continua) e **NÃO ACEITO** (desqualifica).

## Riscos e validações
- Risco baixo, mudança isolada.
- Validar manualmente:
  - Renda 1/2 → termos → ACEITO → formulário.
  - Renda 1/2 → termos → NÃO ACEITO → desqualifica com mensagem correta.
