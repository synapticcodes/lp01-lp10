
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

let redirectInProgress = false;

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
  incomeOrigin?: string;
  mainProblem?: string;
  incomeRange?: string;
}

type AirtableSubmissionOptions = {
  navigateOnSuccess?: boolean;
};

export const useAirtableSubmission = (options: AirtableSubmissionOptions = {}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const navigateOnSuccess = options.navigateOnSuccess ?? true;

  const LEADS_URL =
    (import.meta.env.VITE_LEADS_API_URL as string | undefined) ??
    "https://leads.meunomeok.uk/leads";

  const getCookie = (name: string) => {
    return (
      document.cookie
        .split(";")
        .map((c) => c.trim())
        .find((c) => c.startsWith(name + "="))
        ?.split("=")[1] ?? null
    );
  };

  const getUtms = () => {
    const params = new URLSearchParams(window.location.search || "");
    return {
      utm_source: params.get("utm_source") || undefined,
      utm_medium: params.get("utm_medium") || undefined,
      utm_campaign: params.get("utm_campaign") || undefined,
      utm_term: params.get("utm_term") || undefined,
      utm_content: params.get("utm_content") || undefined,
      utm_placement: params.get("utm_placement") || undefined,
      utm_site_source_name: params.get("utm_site_source_name") || undefined,
      page_url: window.location.href,
      referrer: document.referrer || undefined,
    };
  };

  const buildSlug = () => {
    const host = window.location.hostname || "localhost";
    const path = window.location.pathname || "/";
    return `${host}${path}`;
  };

  const toOptional = (value: unknown) => {
    if (typeof value !== "string") return undefined;
    const v = value.trim();
    return v ? v : undefined;
  };

  const toSimNao = (value: unknown) => {
    if (value === true) return "Sim";
    if (value === false) return "Não";
    return undefined;
  };

  const toSimNaoNaoSei = (value: unknown) => {
    if (value === "yes") return "Sim";
    if (value === "no") return "Não";
    if (value === "unknown") return "Não sei";
    return undefined;
  };

  const redirectWithFallback = async (redirectUrl: string) => {
    if (redirectInProgress) return;

    // A ideia é evitar mandar o usuário para uma tela 503 do router.
    // Tentamos validar rapidamente a URL; se retornar 5xx/timeout, caímos em /obrigado.
    const timeoutMs = 2500;
    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

    try {
      const url = new URL(redirectUrl);

      // IMPORTANTE: nunca fazemos probe em /r/... porque isso gera ClickEvent/CTA_CLICK no backend.
      // Em vez disso, fazemos uma checagem neutra no origin do router.
      const probeUrl = url.origin + "/";

      const response = await fetch(probeUrl, {
        method: "GET",
        signal: controller.signal,
        cache: "no-store",
        redirect: "manual",
        mode: "cors",
      });

      if (response.status >= 500) {
        console.warn("redirect_url indisponível (5xx); fallback para /obrigado", {
          status: response.status,
          probeUrl,
        });
        navigate("/obrigado");
        return;
      }

      // 2xx/3xx/4xx ou qualquer outro caso não-5xx: segue o redirect.
      redirectInProgress = true;
      window.location.assign(redirectUrl);
    } catch (err) {
      // Se foi timeout, tratamos como indisponível.
      if (err instanceof DOMException && err.name === "AbortError") {
        console.warn("redirect_url timeout; seguindo com redirect");
        redirectInProgress = true;
        window.location.assign(redirectUrl);
        return;
      }

      // Erros genéricos (inclui possível bloqueio CORS): não conseguimos validar.
      // Para não quebrar o fluxo em ambientes onde o router está ok, seguimos com o redirect.
      console.warn("Não foi possível validar redirect_url; seguindo com redirect", err);
      redirectInProgress = true;
      window.location.assign(redirectUrl);
    } finally {
      window.clearTimeout(timeoutId);
    }
  };

  const submitLead = async (leadData: LeadData) => {
    setIsSubmitting(true);
    
    try {
      const slug = buildSlug();
      const fbp = getCookie("_fbp");
      const fbc = getCookie("_fbc");
      const utms = getUtms();

      const fields: Record<string, unknown> = {
        "Aposentado/Pensionista INSS": toSimNao(leadData.isInssRetireeOrPensioner),
        "Benefício acima de R$ 2.000?": toSimNaoNaoSei(leadData.benefitAbove2k),
        "Faixa do benefício": leadData.benefitRange,
        "Idade": leadData.age,
        "Situação perante o INSS": leadData.inssSituation,
        "Tipo de dívida": leadData.debtType,
        "Faixa de descontos": leadData.discountRange,
        "Valor do benefício (R$)": leadData.benefitAmount,
        "Total de dívidas (R$)": leadData.debtsTotal,
        "Banco principal": leadData.bankMain,
        "Tipo de lead": leadData.leadType,
        "Motivo dos descontos": leadData.discountReason,
        "Origem da renda": leadData.incomeOrigin,
        "Principal problema": leadData.mainProblem,
        "Renda mensal aproximada": leadData.incomeRange,
      };

      const payload = {
        slug,
        name: toOptional(leadData.name),
        email: toOptional(leadData.email ?? ""),
        phone: toOptional(leadData.phone),
        fields: Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined)),
        ...utms,
        fbp: fbp ? decodeURIComponent(fbp) : undefined,
        fbc: fbc ? decodeURIComponent(fbc) : undefined,
      };

      const res = await fetch(LEADS_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Erro ao enviar lead");
      }

      const json = (await res.json()) as { redirect_url?: string };

      // On successful submission, mark that lead was submitted
      localStorage.setItem("leadSubmitted", "true");

      if (json.redirect_url) {
        await redirectWithFallback(json.redirect_url);
        return true;
      }

      if (navigateOnSuccess) {
        navigate("/obrigado");
      }

      return true;
    } catch (error) {
      console.error("Erro ao enviar lead:", error);
      
      toast({
        title: "Erro de conexão",
        description: "Não foi possível enviar seus dados. Tente novamente.",
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
