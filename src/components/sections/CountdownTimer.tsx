
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          return 15 * 60; // Reset to 15 minutes
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format timer display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <section className="py-4 md:py-6 bg-lavender-solid">
      <div className="container mx-auto text-center px-3">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 md:w-6 md:h-6 text-blue-vibrant" />
            <span className="text-gray-800 font-medium text-sm md:text-base">Esta oferta expira em:</span>
          </div>
          <span className="text-blue-vibrant font-bold text-xl md:text-2xl font-mono">
            ⌛ {formatTime(timeLeft)}
          </span>
        </div>
      </div>
    </section>
  );
};
