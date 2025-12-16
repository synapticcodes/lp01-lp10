
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

interface UTMParams {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_term: string;
  utm_content: string;
  utm_placement: string;
  utm_site_source_name: string;
}

export const useUTMParams = () => {
  const location = useLocation();
  const [utmParams, setUtmParams] = useState<UTMParams>({
    utm_source: 'landing-page',
    utm_medium: 'organic',
    utm_campaign: 'margem-consignavel',
    utm_term: '',
    utm_content: '',
    utm_placement: '',
    utm_site_source_name: 'lovable-app'
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    
    // Captura os UTMs da URL ou usa os valores padrão
    const capturedUTMs: UTMParams = {
      utm_source: urlParams.get('utm_source') || 'landing-page',
      utm_medium: urlParams.get('utm_medium') || 'organic',
      utm_campaign: urlParams.get('utm_campaign') || 'margem-consignavel',
      utm_term: urlParams.get('utm_term') || '',
      utm_content: urlParams.get('utm_content') || '',
      utm_placement: urlParams.get('utm_placement') || '',
      utm_site_source_name: urlParams.get('utm_site_source_name') || 'lovable-app'
    };

    setUtmParams(capturedUTMs);

    // Persiste os UTMs no localStorage para manter entre navegações
    localStorage.setItem('utmParams', JSON.stringify(capturedUTMs));
    
    console.log('UTM Parameters captured:', capturedUTMs);
  }, [location.search]);

  // Tenta recuperar UTMs do localStorage se não houver na URL
  useEffect(() => {
    const storedUTMs = localStorage.getItem('utmParams');
    if (storedUTMs && !location.search) {
      try {
        const parsedUTMs = JSON.parse(storedUTMs);
        setUtmParams(parsedUTMs);
      } catch (error) {
        console.error('Error parsing stored UTM params:', error);
      }
    }
  }, [location.search]);

  return utmParams;
};
