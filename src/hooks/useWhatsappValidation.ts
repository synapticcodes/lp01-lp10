import { useState, useCallback } from 'react';

export interface WhatsappValidationResult {
  exists: boolean;
  jid?: string;
}

export const useWhatsappValidation = () => {
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateWhatsapp = useCallback(async (phone: string) => {
    const numbersOnly = phone.replace(/\D/g, '');
    
    // Só valida se tiver 11 dígitos
    if (numbersOnly.length !== 11) {
      setIsValid(null);
      setValidationError(null);
      return;
    }

    // Sistema provisório: substituímos 100% as integrações antigas (incluindo validação externa).
    // Mantemos este hook como no-op para não quebrar o UX/fluxo dos formulários.
    setIsValidating(false);
    setIsValid(null);
    setValidationError(null);
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