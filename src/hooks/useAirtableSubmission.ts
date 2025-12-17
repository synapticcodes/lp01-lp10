
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { useUTMParams } from "@/hooks/useUTMParams";

interface LeadData {
  name: string;
  phone: string;
  email?: string;
  isInssRetireeOrPensioner?: boolean;
  benefitAbove2k?: 'yes' | 'no' | 'unknown';
  benefitRange?: string;
  age?: number;
  inssSituation?: string;
  debtType?: string;
  discountRange?: string;
  benefitAmount?: number;
  debtsTotal?: number;
  bankMain?: string;
  leadType?: string;
  discountReason?: string;
}

type AirtableSubmissionOptions = {
  navigateOnSuccess?: boolean;
};

export const useAirtableSubmission = (options: AirtableSubmissionOptions = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const utmParams = useUTMParams();
  const navigateOnSuccess = options.navigateOnSuccess ?? true;

  const airtable = {
    token: (import.meta.env.VITE_AIRTABLE_TOKEN as string | undefined) ?? "",
    baseId: (import.meta.env.VITE_AIRTABLE_BASE_ID as string | undefined) ?? "",
    tableName: (import.meta.env.VITE_AIRTABLE_TABLE_NAME as string | undefined) ?? "Leads",
  };

  const submitLead = async (leadData: LeadData) => {
    setIsSubmitting(true);
    
    try {
      if (!airtable.token || !airtable.baseId) {
        console.error("Missing Airtable env vars. Set VITE_AIRTABLE_TOKEN and VITE_AIRTABLE_BASE_ID.");
        toast({
          title: "Configuração incompleta",
          description: "Não foi possível enviar seus dados. Tente novamente mais tarde.",
          variant: "destructive",
        });
        return false;
      }

      const baseFields = {
        "Nome do lead": leadData.name,
        "Telefone do lead": leadData.phone,
        "Email do lead": leadData.email ?? "",
        "Utm_campaign": utmParams.utm_campaign,
        "Utm_source": utmParams.utm_source,
        "Utm_medium": utmParams.utm_medium,
        "Utm_term": utmParams.utm_term,
        "Utm_content": utmParams.utm_content,
        "Utm_placement": utmParams.utm_placement,
        "Utm_site_source_name": utmParams.utm_site_source_name,
      };

      const extraFields = {
        "Aposentado/Pensionista INSS":
          typeof leadData.isInssRetireeOrPensioner === 'boolean'
            ? (leadData.isInssRetireeOrPensioner ? 'Sim' : 'Não')
            : undefined,
        "Benefício > R$ 2.000": leadData.benefitAbove2k ? leadData.benefitAbove2k : undefined,
        "Faixa do benefício": leadData.benefitRange,
        "Idade": typeof leadData.age === 'number' ? leadData.age : undefined,
        "Situação perante o INSS": leadData.inssSituation,
        "Tipo de dívida": leadData.debtType,
        "Faixa de descontos": leadData.discountRange,
        "Valor do benefício (R$)":
          typeof leadData.benefitAmount === "number" ? leadData.benefitAmount : undefined,
        "Total de dívidas (R$)":
          typeof leadData.debtsTotal === "number" ? leadData.debtsTotal : undefined,
        "Banco principal": leadData.bankMain,
        "Tipo de lead": leadData.leadType,
        "Motivo dos descontos": leadData.discountReason,
      };

      const buildPayload = (fields: Record<string, unknown>) => ({
        records: [
          {
            fields,
          },
        ],
      });

      const fullFields: Record<string, unknown> = {
        ...baseFields,
        ...Object.fromEntries(Object.entries(extraFields).filter(([, v]) => v !== undefined)),
      };

      const airtableData = buildPayload(fullFields);

      console.log('Sending lead data with UTM params:', airtableData);

      const postToAirtable = async (payload: unknown) =>
        fetch(`https://api.airtable.com/v0/${airtable.baseId}/${encodeURIComponent(airtable.tableName)}`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${airtable.token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

      let response = await postToAirtable(airtableData);

      if (response.ok) {
        const result = await response.json();
        console.log("Lead submitted successfully:", result);
        
        // Redirecionar para a página de agradecimento (quando habilitado)
        if (navigateOnSuccess) {
          navigate("/obrigado");
        }
        
        // On successful submission, mark that lead was submitted
        localStorage.setItem('leadSubmitted', 'true');
        
        return true;
      } else {
        let error: any = null;
        try {
          error = await response.json();
        } catch {
          error = null;
        }
        console.error("Airtable API error:", error);

        const errorMessage =
          (error?.error?.message as string | undefined) ||
          (typeof error?.message === 'string' ? error.message : undefined) ||
          "";

        const looksLikeUnknownField =
          /UNKNOWN_FIELD_NAME|Unknown field|invalid.*field/i.test(errorMessage);

        if (looksLikeUnknownField) {
          console.warn('Airtable columns missing for extra fields; retrying with base fields only');
          response = await postToAirtable(buildPayload(baseFields));

          if (response.ok) {
            const result = await response.json();
            console.log("Lead submitted successfully (fallback):", result);

            if (navigateOnSuccess) {
              navigate("/obrigado");
            }
            localStorage.setItem('leadSubmitted', 'true');
            return true;
          }
        }
        
        toast({
          title: "Erro ao enviar dados",
          description: "Não foi possível registrar seus dados. Tente novamente.",
          variant: "destructive"
        });
        
        return false;
      }
    } catch (error) {
      console.error("Error submitting to Airtable:", error);
      
      toast({
        title: "Erro de conexão",
        description: "Erro ao conectar com nossos serviços. Verifique sua conexão.",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitLead
  };
};
