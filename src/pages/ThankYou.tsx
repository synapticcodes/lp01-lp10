
import { useEffect, useState } from "react";
import { TrustBar } from "@/components/ui/TrustBar";

const ThankYou = () => {
  const [isVideoLoading, setIsVideoLoading] = useState(true);

  useEffect(() => {
    // Simular carregamento do vídeo
    const timer = setTimeout(() => {
      setIsVideoLoading(false);
    }, 2000);

    // Auto-scroll suave para o vídeo
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Tracking do evento de visualização da página
    console.log("Thank You page loaded - Video view event");

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-lavender-500 to-lavender flex flex-col">
      {/* Progress Stepper */}
      <div className="text-center pt-6 pb-4">
        <p className="text-gray-600 text-sm font-medium">
          Passo 1 de 2 • Assista (2 min)
        </p>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-4 pb-20">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Headline - Improved contrast and sizing */}
          <h1 className="text-lavender-800 font-bold text-2xl leading-tight text-center max-w-xs mx-auto sm:max-w-md sm:text-3xl">
            Assista agora: O método comprovado que faz os bancos pararem imediatamente com descontos no seu consignado — e veja se ele serve para você.
          </h1>

          {/* Video Hero - Full-width responsive */}
          <div className="relative w-full max-w-4xl mx-auto">
            {isVideoLoading ? (
              // Loading state
              <div className="aspect-video bg-gray-100 rounded-2xl flex flex-col items-center justify-center shadow-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lavender-700 mb-4"></div>
                <p className="text-lavender-700 font-medium">Carregando seu vídeo…</p>
              </div>
            ) : (
              // Video player with Panda Video iframe
              <div className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
                {/* 100% Guarantee badge - top left */}
                <div className="absolute top-4 left-4 bg-yellow-vibrant text-gray-900 px-3 py-1 rounded-full text-sm font-bold z-10">
                  100% Garantido
                </div>
                
                {/* Panda Video iframe */}
                <iframe 
                  id="panda-8795b366-a314-4f5f-82a6-e27353d53ac2"
                  src="https://player-vz-e80a8275-32a.tv.pandavideo.com.br/embed/?v=8795b366-a314-4f5f-82a6-e27353d53ac2"
                  className="w-full h-full"
                  style={{ border: 'none' }}
                  allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture"
                  allowFullScreen={true}
                  title="Vídeo explicativo mostrando como o serviço bloqueia descontos em benefícios consignados"
                ></iframe>
              </div>
            )}
          </div>

          {/* Updated Guidance Text */}
          <div className="text-center max-w-md mx-auto">
            <p className="text-gray-700 text-base leading-relaxed">
              Se o vídeo acima fez sentido para você, responda nossa especialista <span className="font-bold text-green-600">Vera Lúcia Nogueira</span> que entrará em contato com você pelo WhatsApp para realizar a consulta gratuita
            </p>
          </div>

          {/* Trust Bar */}
          <div className="flex justify-center">
            <TrustBar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
