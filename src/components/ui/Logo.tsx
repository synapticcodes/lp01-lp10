
interface LogoProps {
  className?: string;
  onClick?: () => void;
}

export const Logo = ({ className = "", onClick }: LogoProps) => {
  return (
    <div 
      onClick={onClick}
      className={`cursor-pointer transition-opacity hover:opacity-90 ${className}`}
      title="Logo ConsigPro — ajuda financeira simples e transparente"
    >
      <img 
        src="/lovable-uploads/25ad710c-4511-40bc-9030-493ff9556503.png"
        alt="Logo ConsigPro"
        className="h-16 w-auto"
      />
    </div>
  );
};
