
import { Logo } from "@/components/ui/Logo";

export const Header = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="bg-white/95 backdrop-blur-sm border-b border-lavender/20">
      <div className="container mx-auto px-4 py-4">
        <Logo onClick={scrollToTop} />
      </div>
    </header>
  );
};
