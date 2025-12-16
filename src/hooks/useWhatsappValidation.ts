import { useState, useCallback } from 'react';

export interface WhatsappValidationResult {
  exists: boolean;
  jid?: string;
}

export const useWhatsappValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validator = {
    url:
      (import.meta.env.VITE_WHATSAPP_VALIDATOR_URL as string | undefined) ??
      "https://api.meunomeok.uk/chat/whatsappNumbers/Validador%20WhatsApp",
    apiKey: (import.meta.env.VITE_WHATSAPP_VALIDATOR_APIKEY as string | undefined) ?? "",
  };

  const convertToInternationalFormat = (phone: string): string => {
    // Remove todos os caracteres não numéricos
    const numbersOnly = phone.replace(/\D/g, '');
    
    // Se já tem 13 dígitos (55 + 11), retorna como está
    if (numbersOnly.length === 13 && numbersOnly.startsWith('55')) {
      return numbersOnly;
    }
    
    // Se tem 11 dígitos, adiciona o código do país 55
    if (numbersOnly.length === 11) {
      return `55${numbersOnly}`;
    }
    
    return numbersOnly;
  };

  const validateWhatsapp = useCallback(async (phone: string) => {
    const numbersOnly = phone.replace(/\D/g, '');
    
    // Só valida se tiver 11 dígitos
    if (numbersOnly.length !== 11) {
      setIsValid(null);
      setValidationError(null);
      return;
    }

    setIsValidating(true);
    setValidationError(null);

    try {
      if (!validator.apiKey) {
        // Sem chave configurada, não valida para não quebrar o fluxo.
        setIsValid(null);
        setValidationError(null);
        return;
      }

      const internationalPhone = convertToInternationalFormat(phone);
      
      const response = await fetch(validator.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': validator.apiKey
        },
        body: JSON.stringify({ numbers: [internationalPhone] })
      });

      if (!response.ok) {
        throw new Error(`Erro na API: ${response.status}`);
      }

      const data = await response.json();
      const result: WhatsappValidationResult = data[0];

      setIsValid(result.exists);
      
      if (!result.exists) {
        setValidationError('Número não existe no WhatsApp');
      }
    } catch (error) {
      console.error('Erro ao validar WhatsApp:', error);
      setValidationError('Erro ao validar número');
      setIsValid(null); // Em caso de erro, não bloqueia o envio
    } finally {
      setIsValidating(false);
    }
  }, []);

  const resetValidation = useCallback(() => {
    setIsValidating(false);
    setIsValid(null);
    setValidationError(null);
  }, []);

  return {
    isValidating,
    isValid,
    validationError,
    validateWhatsapp,
    resetValidation
  };
};