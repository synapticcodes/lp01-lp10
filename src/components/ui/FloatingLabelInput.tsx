
import React from "react";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { formatPhoneNumber } from "@/utils/phoneUtils";

interface FloatingLabelInputProps {
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  focusedField: string | null;
  setFocusedField: (field: string | null) => void;
  isValidating?: boolean;
  isValid?: boolean | null;
  validationError?: string | null;
  required?: boolean;
}

export const FloatingLabelInput = ({ 
  id, 
  type, 
  placeholder, 
  value, 
  onChange, 
  icon: Icon, 
  label,
  focusedField,
  setFocusedField,
  isValidating = false,
  isValid = null,
  validationError = null,
  required = true,
}: FloatingLabelInputProps) => {
  const isFocused = focusedField === id;
  const hasValue = value.length > 0;
  const showFloatingLabel = isFocused || hasValue;
  const showError = isValid === false;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    
    if (type === 'tel') {
      const formattedValue = formatPhoneNumber(inputValue);
      onChange(formattedValue);
    } else {
      onChange(inputValue);
    }
  };

  // Renderizar ícone correto baseado no estado de validação
  const renderIcon = () => {
    if (type === 'tel' && isValidating) {
      return <Loader2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-lavender-500 animate-spin" />;
    }
    if (type === 'tel' && isValid === true) {
      return <CheckCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-500" />;
    }
    if (type === 'tel' && isValid === false) {
      return <AlertCircle className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-red-500" />;
    }
    return <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-lavender-500 opacity-60" />;
  };

  return (
    <div className="relative w-full min-w-0">
      <div className="relative">
        {renderIcon()}
        <Input
          id={id}
          type={type === 'tel' ? 'text' : type}
          placeholder={showFloatingLabel ? "" : placeholder}
          value={value}
          onChange={handleChange}
          onFocus={() => setFocusedField(id)}
          onBlur={() => setFocusedField(null)}
          className={`h-11 pl-10 pr-4 text-base rounded-lg border-gray-200 focus:border-lavender-400 focus:ring-lavender-400 transition-all duration-200 ${showFloatingLabel ? 'pt-5 pb-2' : ''} ${
            showError ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''
          }`}
          required={required}
          disabled={type === 'tel' ? isValidating : false}
        />
      </div>
      {showFloatingLabel && (
        <label 
          htmlFor={id}
          className="absolute left-10 top-1 text-xs font-semibold text-lavender-600 transform transition-all duration-200 pointer-events-none"
        >
          {label}
        </label>
      )}
      {/* Mensagem de erro de validação */}
      {validationError && (
        <p className="mt-1 text-xs text-red-500 font-medium">
          {validationError}
        </p>
      )}
    </div>
  );
};
