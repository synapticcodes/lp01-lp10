# Design — Triagem de renda na LP08

## Contexto
A LP08 foi ativada como cópia da LP07. O usuário solicitou uma triagem adicional após a seleção de situação (Aposentado/Servidor), para filtrar por renda disponível mensal.

## Objetivo
Inserir um passo de triagem que pergunta quanto sobra no bolso todo mês. Se a resposta for abaixo de R$ 3.000, o usuário é desclassificado. Se for entre R$ 3.000 e R$ 5.000 ou acima de R$ 5.000, segue para o formulário. A resposta deve ser enviada no payload do lead.

## Escopo das mudanças
- Arquivo único: `src/forms/lead/variants/lp08.tsx`.
- Novos estados:
  - `incomeRange` para armazenar a resposta da triagem.
  - `disqualifyReason` para diferenciar CLT de renda baixa.
- Novo passo no fluxo: `income` entre `qualify` e `form`.
- Payload do lead: incluir `incomeRange` no envio (campo já suportado pelo backend via `useAirtableSubmission`).

## Fluxo
1. **Qualificação inicial** (situação):
   - Aposentado/Servidor → passo `income`.
   - CLT → desqualifica (`disqualifyReason = clt`).
2. **Triagem de renda**:
   - Acima de R$ 5.000 → formulário.
   - Entre R$ 3.000 e R$ 5.000 → formulário.
   - Abaixo de R$ 3.000 → desqualifica (`disqualifyReason = low_income`).
3. **Formulário**:
   - Envia os dados com `incomeRange` mapeado para rótulo legível.

## Mensagens de desqualificação
- **CLT**: mantém mensagem atual.
- **Renda baixa**: mensagem específica indicando priorização de renda acima de R$ 3.000.

## Riscos e validações
- Risco baixo, mudança isolada à LP08.
- Validar manualmente:
  - `/lp08` → Aposentado/Servidor → renda 1/2 → formulário abre.
  - `/lp08` → Aposentado/Servidor → renda 3 → desqualifica com texto correto.
  - `/lp08` → CLT → desqualifica com texto correto.
  - Submissão inclui `incomeRange` no payload.
