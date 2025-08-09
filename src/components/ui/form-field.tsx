import React from 'react';
import { Input } from './input';
import type { LucideIcon } from 'lucide-react';

interface FormFieldProps {
  label: string;
  icon: LucideIcon;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  maxLength?: number;
  helper?: string;
  error?: string;
  disabled?: boolean;
}

/**
 * Reusable form field component with consistent styling and validation
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  icon: Icon,
  id,
  value,
  onChange,
  type = "text",
  placeholder,
  required = false,
  maxLength,
  helper,
  error,
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <label 
        htmlFor={id} 
        className="text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2"
      >
        <Icon size={16} className="text-slate-500" />
        {label}
        {required && <span className="text-red-500" aria-label="required">*</span>}
      </label>
      
      <div className="relative group">
        <Input
          id={id}
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          required={required}
          maxLength={maxLength}
          disabled={disabled}
          aria-describedby={helper ? `${id}-helper` : error ? `${id}-error` : undefined}
          aria-invalid={error ? 'true' : 'false'}
          className={`w-full pl-4 pr-4 py-3 border-2 rounded-xl focus:ring-4 transition-all duration-200 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 ${
            error 
              ? 'border-red-300 dark:border-red-700 focus:border-red-500 dark:focus:border-red-400 focus:ring-red-500/20 dark:focus:ring-red-400/20' 
              : 'border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-blue-500/20 dark:focus:ring-blue-400/20'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        />
      </div>
      
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-600 dark:text-red-400 ml-1" role="alert">
          {error}
        </p>
      )}
      
      {helper && !error && (
        <p id={`${id}-helper`} className="text-xs text-slate-500 dark:text-slate-400 ml-1">
          {helper}
        </p>
      )}
    </div>
  );
};
